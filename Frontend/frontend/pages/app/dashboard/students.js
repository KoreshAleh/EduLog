import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../../styles/dashboard.module.css";
import HeaderBar from "@/components/HeaderBar";
import GradeChart from "@/components/GradeChart";
import StudentList from "@/components/StudentList";
import SubjectCard from "@/components/SubjectCard";
import { fetchGrades } from "@/utils/fetchGrades";


function Students() {
  // --- State for API data ---
  const [data_api, setGrade] = useState({
    grade: [],
    average: [],
    subject: [],
  });
  const [role, setRole] = useState(null)
  const [email, setEmail] = useState(null)

  // --- API Base URL ---
  const API = "https://mts3ow3lb2.execute-api.eu-central-1.amazonaws.com/dev";

  const router = useRouter();
  const { studentEmail } = router.query;
  const decodedEmail = studentEmail ? decodeURIComponent(studentEmail) : null;


  useEffect(()=> {
      setRole(localStorage.getItem("LoginRole"));
      setEmail(localStorage.getItem("selectedStudentEmail"));
  }, [])



  /**
   * Load all data (grades, averages, subjects) once the student's email is available.
   */
  useEffect(() => {
    if (!decodedEmail) return;

    const loadData = async () => {
      const grade = await fetchGrades(API, decodedEmail, "grades");
      const average = await fetchGrades(API, decodedEmail, "average");
      const subject = await fetchGrades(API, decodedEmail, "subject");

      setGrade({ grade, average, subject });
    };

    loadData();
  }, [decodedEmail]);

  // --- Merge subjects with corresponding grades and averages ---
  const mergedSubjects = Array.isArray(data_api.subject)
    ? data_api.subject.map((sub) => {
        const avg = data_api.average.find((a) => a.name === sub.name) || {};
        const grade = data_api.grade.find((g) => g.name === sub.name) || {};

        return {
          name: sub.name,
          average_grade: avg.average_grade ?? null,
          last_grade: grade.grade ?? null,
        };
      })
    : [];

  return (
    <>
      <div className={styles.wrapper}>
        {/* ---------- HEADER ---------- */}
        <HeaderBar
        role={role}
        email={email}
      />

        {/* ---------- MAIN CONTENT ---------- */}
          <main className={styles.main1}>
        <div className={styles.main_container}>
          <div className={styles.left_block}>
            <StudentList subjects={mergedSubjects} />
            <GradeChart data={data_api.grade} />
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

        {/* ---------- FOOTER ---------- */}
        <footer className={styles.footer}>
          <h2 className={styles.title2}>DASHBOARD PAGE</h2>
          <hr />
          <p className={styles.footer_text}>
            Educational portal: <b>EduLog</b> &copy; 2025
          </p>
        </footer>
      </div>
    </>
  );
}

export default Students;
