import React from 'react';
import styles from "./AuthForm.module.scss";
import { useState, useEffect } from 'react';
import Input from "../components/Input";
import Button from "../components/Button";
import Typography from '../components/Typography';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (email: string, password: string) => {
        const res = await fetch('/api/v1/identity/login', {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        });

        if (!res.ok) throw new Error("Login failed");
    }

    function handleSubmit () {
        login(email, password).catch(err => {
            console.error(err);
            console.log(email, password);
            alert("Login failed");
        });
    }

    useEffect(() => {
            document.title = "For18 - Login";
    });

    return (
        <>
            <div className={styles.imageBackground}>
                <div className={styles.container}>
                    <div className={styles.heading}>
                        <Typography heading={1}>Login</Typography>
                    </div>
                    <div className={styles.emailContainer}>
                        <Input type="email" placeholder="email" value={email} onChange={setEmail}/>
                    </div>
                    <div className={styles.passwordContainer}>
                        <Input type="password" placeholder="password" value={password} onChange={setPassword}/>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button onClick={handleSubmit}>Login</Button>
                    </div>
                    <div className={styles.forgotPassword}>
                        <Typography href='../forgotpassword'>Forgot password?</Typography>
                    </div>
                    <div className={styles.noAccount}>
                        <Typography href='../register'>Don't have an account yet?</Typography>
                    </div>
                </div>
            </div>
        </>
    );
}
