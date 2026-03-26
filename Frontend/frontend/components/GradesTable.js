import styles from "../styles/grades.module.css";

export default function GradesTable({ mergedSubjects }) {
  return (
    <div className={styles.wrapper_table}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thSubject}>Subject</th>
            <th className={styles.thGrade}>Grades</th>
            <th className={styles.thDate}>Average Grade</th>
          </tr>
        </thead>
        <tbody>
          {mergedSubjects.map((item, index) => (
            <tr key={index}>
              <td className={styles.tdSubject}>{item.name}</td>
              <td className={styles.tdGrade}>{item.all_grades}</td>
              <td className={styles.tdDate}>{item.average_grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
