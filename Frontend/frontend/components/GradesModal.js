import styles from "../styles/grades.module.css";

export default function GradesModal({
  modalType,
  data,
  selectSub,
  setSelectSub,
  gradeValue,
  setGradeValue,
  gradeValueReplace,
  setGradeValueReplace,
  subjectForGrade,
  onClose,
  onAdd,
  onEdit,
  onDelete
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {modalType === "add" && (
          <>
            <div className={styles.up_block}>
              <h3 className={styles.text_add}>Add Grades</h3>
              <select value={selectSub} onChange={(e) => setSelectSub(e.target.value)}>
                <option value="">Select subject</option>
                {data.subject.map((item, idx) => <option key={idx} value={item.name}>{item.name}</option>)}
              </select>
              <input
                className={styles.input}
                type="text"
                placeholder="Enter grade"
                value={gradeValue}
                onChange={(e) => setGradeValue(e.target.value)}
              />
            </div>
            <button className={styles.buton_modal} onClick={onAdd}>Add</button>
          </>
        )}

        {modalType === "delete" && (
          <>
            <div className={styles.up_block}>
              <h3 className={styles.text_add}>Delete Grades</h3>
              <select value={selectSub} onChange={(e) => setSelectSub(e.target.value)}>
                <option value="">Select subject</option>
                {data.subject.map((item, idx) => <option key={idx} value={item.name}>{item.name}</option>)}
              </select>
              <select value={gradeValue} onChange={(e) => setGradeValue(e.target.value)}>
                <option value="">Select grade</option>
                {subjectForGrade.map((grade, idx) => <option key={idx} value={grade}>{grade}</option>)}
              </select>
            </div>
            <button className={styles.buton_modal} onClick={onDelete}>Yes, delete</button>
          </>
        )}

        {modalType === "edit" && (
          <>
            <div className={styles.up_block}>
              <h3 className={styles.text_add}>Edit Grades</h3>
              <select value={selectSub} onChange={(e) => setSelectSub(e.target.value)}>
                <option value="">Select subject</option>
                {data.subject.map((item, idx) => <option key={idx} value={item.name}>{item.name}</option>)}
              </select>
              <select value={gradeValue} onChange={(e) => setGradeValue(e.target.value)}>
                <option value="">Select grade</option>
                {subjectForGrade.map((grade, idx) => <option key={idx} value={grade}>{grade}</option>)}
              </select>
              <input
                className={styles.input}
                type="text"
                placeholder="Enter new grade"
                value={gradeValueReplace}
                onChange={(e) => setGradeValueReplace(e.target.value)}
              />
            </div>
            <button className={styles.buton_modal} onClick={onEdit}>Save changes</button>
          </>
        )}

        <button className={styles.buton_modal} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
