import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import styles from "../../styles/dashboard.module.css";
import HeaderBar from "@/components/HeaderBar";
import GradeChart from "@/components/GradeChart";
import StudentList from "@/components/StudentList";
import SubjectCard from "@/components/SubjectCard";
import ListStudents from "@/components/ListStudentsForTeachers";
import { fetchDashboard } from "@/utils/fetchDashboard";


;



function Dashboard() {
  const router = useRouter();
  const API = "https://mts3ow3lb2.execute-api.eu-central-1.amazonaws.com/dev";

  // Component state
  const [data, setData] = useState({
    grades: [],
    average: [],
    allStudents: [],
    subject: [],
  });
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null)





  // --- Decode user role from Cognito token ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    const idToken = localStorage.getItem("idToken");
    if (!idToken) return;

    const payload = idToken.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    const userRole = decoded["cognito:groups"]?.[0];
    setRole(userRole);
  }, []);

  // --- Fetch data after role is known ---
  useEffect(() => {
    if (typeof window === "undefined" || !role) return;
    const idToken = localStorage.getItem("idToken");
    if (!idToken) return;

    console.log("Sending token:", idToken);

    // Fetch reports (used mainly for Teachers)
    let url = "https://jzous6cu7c.execute-api.eu-central-1.amazonaws.com/auth/reports";
    if (role === "Teachers") {
      const selectedStudentEmail = localStorage.getItem("selectedStudentEmail");
      setEmail(selectedStudentEmail)
      if (selectedStudentEmail) {
        url += `?studentEmail=${encodeURIComponent(selectedStudentEmail)}`;
      }
    }

    fetch(url, { headers: { Authorization: `Bearer ${idToken}` } })
      .then(async (res) => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      })
      .then((data) => console.log("Reports:", data))
      .catch(console.error);

    // Fetch dashboard data
    const loadData = async () => {
      const grades = await fetchDashboard(API, "grades");
      const average = await fetchDashboard(API, "average");
      const allStudents = await fetchDashboard(API, "allStudents");
      const subject = await fetchDashboard(API, "subject");
      setData({ grades, average, allStudents, subject });
    };

    loadData();
  }, [role]);

  // --- Save role in localStorage ---
  useEffect(() => {
    if (role && typeof window !== "undefined") {
      localStorage.setItem("LoginRole", role);
    }
  }, [role]);

  if (!role) {
    return <div>Loading...</div>;
  }

    const handleSelectStudent = (email) => {
    localStorage.setItem("selectedStudentEmail", email);
    router.push(`/app/dashboard/students?studentEmail=${encodeURIComponent(email)}`);
  };

  // --- Merge subjects with grades and averages (for Students) ---
  const mergedSubjects = Array.isArray(data.subject)
    ? data.subject.map((sub) => {
        const avg = data.average.find((a) => a.name === sub.name) || {};
        const grade = data.grades.find((g) => g.name === sub.name) || {};
        return {
          name: sub.name,
          average_grade: avg.average_grade ?? null,
          last_grade: grade.grade ?? null,
        };
      })
    : [];

  // ------------------- JSX OUTPUT -------------------
  return (
    <div className={styles.wrapper}>
      {/* ---------- Header ---------- */}
         <HeaderBar
              role={role}
              
            />
      {/* ---------- Student View ---------- */}
      {role === "Students" && (
        <main className={styles.main1}>
        <div className={styles.main_container}>
          <div className={styles.left_block}>
            <StudentList subjects={mergedSubjects} />
            <GradeChart data={data.grades} />
          </div>

          <div className={styles.wrapper_card}>
              {mergedSubjects.map((item, index) => (
                <SubjectCard
                  key={index}
                  name={item.name}
                  average={item.average_grade}
                />
              ))}
          </div>
            </div>
          </main>
      )}

      {/* ---------- Parent View ---------- */}
      {role === "Parents" && (
        <main className={styles.main1}>
        <div className={styles.main_container}>
          <div className={styles.left_block}>
            <StudentList subjects={mergedSubjects} />
            <GradeChart data={data.grades} />
          </div>

          <div className={styles.wrapper_card}>
              {mergedSubjects.map((item, index) => (
                <SubjectCard
                  key={index}
                  name={item.name}
                  average={item.average_grade}
                />
              ))}
          </div>
            </div>
          </main>
      )}

      {/* ---------- Teacher View ---------- */}
      {role === "Teachers" && (
        <main className={styles.main1}>
          <div className={styles.main_container}>
           <ListStudents
           students={data.allStudents}
          onSelectStudent={handleSelectStudent}/>
          </div>
        </main>
      )}

      {/* ---------- Footer ---------- */}
      <footer className={styles.footer}>
        <h2 className={styles.title2}>DASHBOARD PAGE</h2>
        <hr />
        <p className={styles.footer_text}>
          Educational portal: <b>EduLog</b> &copy; 2025
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;