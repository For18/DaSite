import React from 'react';
import styles from "./AuthForm.module.scss";
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

        console.log("Registration successful");
        return res.json();  
    }

    function handleSubmit () {
        register(email, password).catch(err => {
            console.error(err);
            console.log(email, password);
        });
    }

    useEffect(() => {
            document.title = "For18 - Register";
    });

    return (
        <>
            <div className={styles.imageBackground}>
                <div className={styles.container}>
                    <Typography heading={1}>Register</Typography>
                    <Input type="email" placeholder="email" value={email} onChange={setEmail}/>
                    <Input type="password" placeholder="password" value={password} onChange={setPassword}/>
                    <Button onClick={handleSubmit}>Register</Button>
                    <Typography href='/login'>Already have an account?</Typography>
                </div>
            </div>
        </>
    );
}
