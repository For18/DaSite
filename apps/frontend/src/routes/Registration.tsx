import React from 'react';
import styles from "./Login.module.scss";
import { useState, useEffect } from 'react';
import Input from "../components/Input";
import Button from "../components/Button";
import Typography from '../components/Typography';

export default function Registration() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = async (email: string, password: string) => {
        const res = await fetch('/api/v1/identity/register', {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(error || "Registration failed");
        }

        return res.json();  
    }

    function handleSubmit () {
        register(email, password).catch(err => {
            console.error(err);
            console.log(email, password);
            alert("Registration failed");
        });
    }

    useEffect(() => {
            document.title = "For18 - Register";
    });

    return (
        <>
            <div className={styles.imageBackground}>
                <div className={styles.container}>
                    <div className={styles.heading}>
                        <Typography heading={1}>Register</Typography>
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
                    <div className={styles.haveAccount}>
                        <Typography href='../login'>Already have an account?</Typography>
                    </div>
                </div>
            </div>
        </>
    );
}
