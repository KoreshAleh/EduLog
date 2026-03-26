import styles from "../styles/dashboard.module.css";

export default function SubjectCard({ name, average }) {
  return (
    <div className={styles.card}>
      <div className={styles.card_grade}>
        <h4>Average</h4>
        <h4 className={styles.grade_avg}>{average ?? "-"}</h4>
      </div>
      <div className={styles.sub}>
        <h4>{name}</h4>
      </div>
    </div>
  );
}
