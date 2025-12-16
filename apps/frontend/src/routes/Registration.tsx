import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Input from "../components/Input";
import Typography from "../components/Typography";
import { API_URL } from "../lib/api";
import styles from "./AuthForm.module.scss";
import { Routes } from "./Routes";
import { login } from "./Login";
import { useRef } from "react";

export default function Registration() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const navigate = useNavigate();
  const passwordRef = useRef<HTMLInputElement>(null);

	const register = async (email: string, password: string) => {
		const res = await fetch(API_URL + Routes.Identity.PostRegister, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password })
		});

		const text = await res.text();
		let data;

		try {
			data = JSON.parse(text);
		} catch {
			data = text;
		}

		return { works: res.ok, httpStatus: res.status, data };
	};

	async function handleSubmit() {
		const { works, httpStatus, data } = await register(email, password);

		if (!works) {
			console.error("Registration failed:", httpStatus, data);
			return;
		}

		console.log("Registration successful:", httpStatus, data);
    login(email, password);
		navigate(Routes.Pages.Home);
	}

	useEffect(() => {
		document.title = "For18 - Register";
	});

	return (
		<>
			<div className={styles.imageBackground}>
				<div className={styles.container}>
					<Typography heading={1}>Register</Typography>
					<Input type="email" placeholder="email" value={email} onChange={setEmail} onEnter={() => passwordRef.current?.focus()}/>
					<Input type="password" placeholder="password" value={password} onChange={setPassword} inputRef={passwordRef} onEnter={() => handleSubmit()}/>
					<Button onClick={handleSubmit}>Register</Button>
					<Typography href={Routes.Pages.Login}>Already have an account?</Typography>
				</div>
			</div>
		</>
	);
}
