import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/dashboard.module.css";
import logo from "../public/img/logo2.png";

export default function HeaderBar({ role, email }) {
  const router = useRouter();
  const path = router.asPath; 

  
  const isTeacherStudentPage =
    role === "Teachers" && path.includes("/dashboard/students");

  const isGradesPage = path.includes("/Grades");

  const showBack = isTeacherStudentPage || isGradesPage;

  const showGradesPage =
    (role === "Teachers" && isTeacherStudentPage && email) ||
    ((role === "Students" || role === "Parents") &&
      path === "/app/dashboard");

  const showLogout =
    !(role === "Teachers" && isTeacherStudentPage); 


  const handleBack = () => {
    if (isTeacherStudentPage) {

      router.push("/app/dashboard");
    } else if (isGradesPage) {

      if (role === "Teachers") {
        router.push(`/app/dashboard/students?studentEmail=${encodeURIComponent(email)}`);
      } else {
        router.push("/app/dashboard");
      }
    }
  };

  const handleGradesPage = () => {
    if (role === "Teachers" && email) {
      router.push(`/app/Grades?studentEmail=${encodeURIComponent(email)}`);
    } else {
      router.push("/app/Grades");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <header>
      <div className={styles.container}>
        <Link href="/">
          <Image
            src={logo}
            width={65}
            priority
            alt="EduLog Logo"
            className={styles.image}
          />
        </Link>

        <div className={styles.butons}>
          {showBack && (
            <button className={styles.buton} onClick={handleBack}>
              Back
            </button>
          )}

          {showGradesPage && (
            <button className={styles.buton} onClick={handleGradesPage}>
              Grades Page
            </button>
          )}

          {showLogout && (
            <button className={styles.buton} onClick={handleLogout}>
              Log Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
