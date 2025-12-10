import React from 'react';
import styles from "./AuthForm.module.scss";
import { useState, useEffect } from 'react';
import Input from "../components/Input";
import Button from "../components/Button";
import Typography from '../components/Typography';
import { API_URL } from '../lib/api';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (email: string, password: string) => {
        const res = await fetch(API_URL + '/identity/login', {
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
        });
    }

    useEffect(() => {
            document.title = "For18 - Login";
    });

    return (
        <>
            <div className={styles.imageBackground}>
                <div className={styles.container}>
                    <Typography heading={1}>Login</Typography>
                    <Input type="email" placeholder="email" value={email} onChange={setEmail}/>
                    <Input type="password" placeholder="password" value={password} onChange={setPassword}/>
                    <Button onClick={handleSubmit}>Login</Button>
                    <Typography href='../forgotpassword'>Forgot password?</Typography>
                    <Typography href='../register'>Don't have an account yet?</Typography>
                </div>
            </div>
        </>
    );
}
