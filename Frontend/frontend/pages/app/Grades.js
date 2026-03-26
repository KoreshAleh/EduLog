import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/grades.module.css";
import HeaderBar from "@/components/HeaderBar";
import GradesTable from "@/components/GradesTable";
import RoleButtons from "@/components/RoleButtons";
import GradesModal from "@/components/GradesModal";
import { fetchAllgrades, addGrade, editGrade, deleteGrade } from "@/utils/fetchAllgrades";

export default function Grades() {
  const router = useRouter();
  // states
  const [gradeValueReplace, setGradeValueReplace] = useState("");
  const [subjectForGrade, setSubjectForGrade] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectSub, setSelectSub] = useState("");
  const [gradeValue, setGradeValue] = useState("");
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState(null);
  const [data, setData] = useState({ subject: [], allGrades: [] });

  const closeModal = () => setModalType(null);

  const API = "https://mts3ow3lb2.execute-api.eu-central-1.amazonaws.com/dev";

useEffect(() => {
  const roleFromStorage = localStorage.getItem("LoginRole");
  let emailFromStorage = localStorage.getItem("selectedStudentEmail");

  // check email students or teachers
  if (roleFromStorage === "Students" && !emailFromStorage) {
    const idToken = localStorage.getItem("idToken");
    if (idToken) {
      const payload = JSON.parse(atob(idToken.split(".")[1]));
      emailFromStorage = payload.email; 
    }
  }

  setRole(roleFromStorage);
  setEmail(emailFromStorage);
}, []);



  useEffect(() => {
    if (email && role) loadData();
  }, [email, role]);

// loadind users data
const loadData = async () => {
  const [allGrades, subject] = await Promise.all([
    fetchAllgrades(API, email, role, "allGrades"),
    fetchAllgrades(API, null, null, "subject"),
  ]);
  setData({ allGrades, subject });
};

  useEffect(() => {
    if ((selectSub || modalType === "edit") && Array.isArray(data.allGrades)) {
      const subjectData = data.allGrades.find((item) => item.subject === selectSub);
      const gradeArr = subjectData?.all_grades
        ? Array.isArray(subjectData.all_grades)
          ? subjectData.all_grades
          : subjectData.all_grades.split(",").map((g) => g.trim())
        : [];
      setSubjectForGrade(gradeArr);
    } else {
      setSubjectForGrade([]);
    }
  }, [selectSub, data.allGrades, modalType]);

  const mergedSubjects = data.subject.map((sub) => {
  const all = data.allGrades.find((a) => a.subject === sub.name) || {};

  console.log("All grades for subject:", all);
  let grades = "-";
  if (all.all_grades) {
    grades = Array.isArray(all.all_grades)
      ? all.all_grades.join(", ")
      : all.all_grades;
  }

  return {
    name: sub.name,
    all_grades: grades,
    average_grade: all.average_grade ?? "-"
  };
});
console.log("Merged subjects:", mergedSubjects);
console.log(data)


  const handleAdd = async () => { await addGrade(email, selectSub, gradeValue); setGradeValue(""); setSelectSub(""); closeModal(); loadData(); };
  const handleEdit = async () => { await editGrade(email, selectSub, gradeValue, gradeValueReplace); setGradeValue(""); setSelectSub(""); setGradeValueReplace(""); closeModal(); loadData(); };
  const handleDelete = async () => { await deleteGrade(email, selectSub, gradeValue); setGradeValue(""); setSelectSub(""); closeModal(); loadData(); };

  return (
    <div className={styles.wrapper}>
      {/*   --------HEADERS--------- */}
         <HeaderBar
              role={role}
              email={email}
            />
      {/*------------MAIN------------ */}
      <main className={styles.main1}>
        <div className={styles.main_container}>
          <GradesTable mergedSubjects={mergedSubjects} />
          {role === "Teachers" && (
            <RoleButtons
              onAdd={() => setModalType("add")}
              onEdit={() => setModalType("edit")}
              onDelete={() => setModalType("delete")}
            />
          )}

          {role === "Teachers" && modalType && (
            <GradesModal
              modalType={modalType}
              data={data}
              selectSub={selectSub}
              setSelectSub={setSelectSub}
              gradeValue={gradeValue}
              setGradeValue={setGradeValue}
              gradeValueReplace={gradeValueReplace}
              setGradeValueReplace={setGradeValueReplace}
              subjectForGrade={subjectForGrade}
              onClose={closeModal}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>

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
