import styles from "../styles/grades.module.css"

export default function RoleButtons({ onAdd, onEdit, onDelete }) {
  return (
    <div className={styles.buttons}>
      <button className={styles.buton_tb} onClick={onAdd}>Add Grades</button>
      <button className={styles.buton_tb} onClick={onDelete}>Delete Grades</button>
      <button className={styles.buton_tb} onClick={onEdit}>Edit Grades</button>
    </div>
  );
}
