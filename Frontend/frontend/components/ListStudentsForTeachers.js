import styles from "../styles/dashboard.module.css";

export default function ListStudents({ students, onSelectStudent }) {
  return (
    <ul className={styles.grade_list}>
      {students.map((student, idx) => (
        <li key={idx} className={styles.grade_item}>
          <button
            className={styles.buton}
            onClick={() => {
              
              onSelectStudent(student.email);
            }}
          >
            {student.fullname}
          </button>
        </li>
      ))}
    </ul>
  );
}
