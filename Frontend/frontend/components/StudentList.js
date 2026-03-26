import styles from "../styles/dashboard.module.css";

export default function StudentList({ subjects }) {
  return (
    <div className={styles.cont_left}>
        <div className={styles.last_grades}>
            <h2 className={styles.text_grades}>Students</h2>
                <ul className={styles.grade_list}>
                    {subjects.map((item, index) => (
                    <li key={index} className={styles.grade_item}>
                        <span className={styles.subject}>{item.name}</span>
                        <span className={styles.grade}>{item.last_grade ?? "-"}</span>
                    </li>
                    ))}
                </ul>
        </div>
    </div>
    
  );
}
