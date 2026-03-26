    import styles from '../styles/callback.module.css'
    import { useEffect } from "react";
    import { useRouter } from "next/router";

    // callback page, get and check tokens after authorization
    export default function callback() {
        const router = useRouter()
        
        useEffect(() => {
            const hash = window.location.hash.substring(1)
            const params = new URLSearchParams(hash)
            const accessToken = params.get("access_token")
            const idToken = params.get("id_token")

            if(accessToken){
                localStorage.setItem("accessToken", accessToken)
                localStorage.setItem("idToken", idToken)
                router.push("/app/dashboard");
            }else{
                router.push("/")
            }
        }, [router])

        return(
            <div className={styles.wait}>Logging in...</div>
        )
    }