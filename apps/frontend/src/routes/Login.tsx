import React from 'react';
import styles from "./Login.module.scss";
import { useRef } from 'react';
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const login = async (email: string, password: string) => {
        const res = await fetch('/identity/login', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
    });

        if (!res.ok) throw new Error("Login failed");
        const data = await res.json();
        localStorage.setItem("token", data.token);
    }

    function handleSubmit () {
        const email = emailRef.current?.value || "";
        const password = passwordRef.current?.value || "";

        login(email, password).catch(err => {
            console.error(err);
            console.log(email, password);
            alert("Login failed");
        });
    }

    return (
        <>
            <Input type="email" placeholder="email" ref={emailRef}/>
            <Input type="password" placeholder="password" ref={passwordRef}/>
            <Button onClick={handleSubmit} variant="text" color="brand" disabled={false}>Submit</Button>
        </>
    );
}