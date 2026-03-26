

import styles from '../styles/login.module.css'
import Image from 'next/image';
import logo from '../public/img/logo2.png'
import Link from 'next/link';


// login page
export default function Login() {
 
  // get data from env
  const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN
  const clientID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
  const redirect_url = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URL
  
  // creating a login URL
  const loginURL = `https://${domain}/login?client_id=${clientID}&response_type=token&scope=email+openid+profile&redirect_uri=${redirect_url}`
  console.log(loginURL)
  console.log("LOGIN URL:", loginURL)

  return(
    <>
    <div className={styles.wrapper}>
        <header>
            <div className={styles.container}>
              <Link href='/'>
                <Image src={logo} width={65} priority className={styles.image}  />
              </Link>
              <a href={loginURL}>
                <button className={styles.buton}>Login</button>
              </a>
          </div> 
      </header>
      <main className={styles.main1}>
      </main>
     <footer className={styles.footer}>
       <h2 className={styles.title}>LOGIN PAGE</h2>
          <hr />
        <p className={styles.footer_text}>Educational portal: <b>EduLog</b> &copy; 2025</p>
     </footer>
    </div>
    </>
  )
}