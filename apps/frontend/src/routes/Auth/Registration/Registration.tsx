import Button from "@component/Button";
import Input from "@component/Input";
import Typography from "@component/Typography";
import { API_URL } from "@lib/api";
import useGoto from "@lib/hooks/useGoto";
import { Routes } from "@route/Routes";
import { useEffect, useState } from "react";
import { useRef } from "react";
import styles from "../AuthForm.module.scss";
import { Status, StatusDisplay } from "@component/StatusDisplay";

async function register(email: string, password: string) {
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

export default function Registration() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const goto = useGoto();
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	const [status, setStatus] = useState<Status>({type: "none", label: ""});

	async function handleSubmit() {
		if (password !== confirmPassword) {
			setStatus({
				type: "error",
				label: "Password does not match confirm password"
			});
			return;
		}

		setStatus({
			type: "progress",
			label: "Registering"
		});

		const { works, httpStatus, data } = await register(email, password);

		if (!works) {
			if (httpStatus === 400) {
				setStatus({
					type: "error",
					label: data.errors[Object.keys(data.errors)[0]]
				});
			} else {
				setStatus({
					type: "error",
					label: `Registration failed: ${httpStatus}, ${data}`
				});
			}
			return;
		}

		setStatus({
			type: "success",
			label: "Success!"
		});
		goto(Routes.Pages.Login);
	}

	useEffect(() => {
		document.title = "For18 - Register";
	});

	return (
		<>
			<div className={styles.imageBackground}>
				<div className={styles.container}>
					<Typography heading={1}>Register</Typography>
					<Input type="email" placeholder="email" value={email} onChange={setEmail}
						onEnter={() => passwordRef.current?.focus()}/>
					<Input type="password" placeholder="password" value={password} onChange={setPassword}
						inputRef={passwordRef} onEnter={() => confirmPasswordRef.current?.focus()}/>
					<Input type="password" placeholder="confirm password" value={confirmPassword}
						onChange={setConfirmPassword} onEnter={() => handleSubmit()} inputRef={confirmPasswordRef}/>
					<Button onClick={handleSubmit}>Register</Button>
					<Typography href={Routes.Pages.Login}>Already have an account?</Typography>
					<StatusDisplay status={status}/>
				</div>
			</div>
		</>
	);
}
