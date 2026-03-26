
import pkg from 'pg';
const { Pool } = pkg;
import e from 'express'
import jwt from 'jsonwebtoken'
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const secretName = "myDataBaseSecret"
const Client = new SecretsManagerClient({ region: "eu-central-1"})
let responseClient




// creating async fanction
export const handler = async (event) => {

  // add secretManager
  try{
    responseClient = await Client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT",
      })
    )
  } catch(error){
    throw error
  }

  const secret = responseClient.SecretString

  const {username, password, host, database, port } = secret

    // create pool
  const pool = new Pool({
  host,
  user: username,
  password,
  database,
  port,
  ssl: { require: true, rejectUnauthorized: false }
});

  // option request
  if(event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
      },
      body: "",
    };
  }
  // created headers
  const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
    }

   // joining paths 
  const path = event.path || event.rawPath




  // get a token
  const authHeader = event.headers?.Authorization || event.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized: No token" }) };
  }

  // taking Authorization data from token
  const token = authHeader.split(" ")[1];
  const decoded = jwt.decode(token)

  // get role
  const role = decoded['cognito:groups'][0]
  // get Email
  const email = decoded.email


 
  // get a body data from next.js
  let body = {};
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      console.log("Failed to parse body:", e);
    }
  }
  const { grade, studentEmail, subj, newGrade } = body;

// get email form queryParameters
const queryEmail = event.queryStringParameters?.studentEmail;


// We check and take the student's email (if logging in as a teacher)
let targetEmail;
if (role === "Teachers") {
  targetEmail =  queryEmail
} else{
  targetEmail = email
}
console.log("Target email resolved to:", targetEmail);




  // API authorization request to receive data from the user
  if(path === "/auth/reports"){
    if (!email || !role) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Missing user data" }),
      };
    }
    // checking roles
  if(role !== "Parents" && role !== "Students" && role !== "Teachers"){
    return{
      statusCode: 403,
      headers,
      body: JSON.stringify({error: "Access denied"})
    }
  }

  return{
    statusCode: 200,
    headers,
    body: JSON.stringify({
      role: role,
      email: email
    })
  }

  }
  
  // connect to database
  const client = await pool.connect();
  if(!client){
    return{
      statusCode: 502,
    body: JSON.stringify({error: "not connect to db"})
    }
  }

 

  // common variable for all database queries
  let result;

  // all database queries
  try {
    // get subject
     if (path === "/subject"){
        result = await client.query(`
        SELECT name FROM subject
        `)
      // get last 5 grades
      } else if (path === "/grades") {
      result = await client.query(`
SELECT s.name, g.grade
FROM grades g
JOIN subject s ON g.subject_id = s.id
JOIN students st ON g.students_id = st.id
JOIN (
  SELECT students_id, subject_id, MAX(id) AS last
  FROM grades
  GROUP BY students_id, subject_id
) AS latest ON g.id = latest.last
WHERE st.email = $1
ORDER BY s.name;
      `, [targetEmail]);
      // get average-grades
    } else if (path === "/average-grades") {
      result = await client.query(`

        SELECT s.name, ROUND(AVG(g.grade)::numeric, 2) AS average_grade
        FROM grades g
        JOIN subject s ON g.subject_id = s.id
        JOIN students st ON g.students_id = st.id
        WHERE st.email = $1
        GROUP BY s.name
        ORDER BY s.name;
      `,[targetEmail]);
      // get all grades(grades and average grades)
    } else if (path === "/all-grades") {
      result = await client.query(`
              SELECT 
      s.name AS subject,
      STRING_AGG(g.grade::text, ', ' ORDER BY g.id) AS all_grades,
      ROUND(AVG(g.grade)::numeric, 2) AS average_grade
    FROM grades g
    JOIN subject s ON g.subject_id = s.id
    JOIN students st ON g.students_id = st.id
    WHERE st.email = $1
    GROUP BY s.name
    ORDER BY s.name;
      `, [targetEmail]);
      // get all students
    }else if(path === "/get-students"){
      result = await client.query(`
        SELECT fullname, email FROM students; 
        `)
        // add grades
    }else if(path === "/add-grades"){
        result = await client.query(`
           INSERT INTO grades (students_id, subject_id, grade, date)
      VALUES (
        (SELECT id FROM students WHERE email = $1),
        (SELECT id FROM subject WHERE name = $2),
        $3,
        NOW()
      )
      RETURNING *;
          `,[studentEmail,  subj, grade])
        // delete grades
    }else if(path === "/delete-grade"){
      result = await client.query(`
        DELETE FROM grades
        WHERE ctid IN (
          SELECT ctid
          FROM grades
          WHERE students_id = (SELECT id FROM students WHERE email = $1)
            AND subject_id = (SELECT id FROM subject WHERE name = $2)
            AND grade = $3
          LIMIT 1
        );
        `, [studentEmail, subj, grade])
        // edit grades
    }else if(path === "/edit-grade"){
        result = await client.query(`
          WITH target AS (
           SELECT id 
           FROM grades 
           WHERE students_id = (SELECT id FROM students WHERE email = $1) 
           AND subject_id = (SELECT id FROM subject WHERE name = $2) 
           AND grade = $3 
           LIMIT 1 ) 
           UPDATE grades 
           SET grade = $4 
           WHERE id IN (SELECT id FROM target);
          `, [studentEmail, subj, grade, newGrade])
    }else{
      return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found" }) };
        
    }


    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.rows)
    };
    console.log(result.rows)
  } catch (err) {
    console.error("Server error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Server error" }) };
  } finally {
    client.release();
  }
};









