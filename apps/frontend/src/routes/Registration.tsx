import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Input from "../components/Input";
import Typography from "../components/Typography";
import { API_URL } from "../lib/api";
import styles from "./AuthForm.module.scss";

export default function Registration() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const navigate = useNavigate();

	const register = async (email: string, password: string) => {
		const res = await fetch(API_URL + "/identity/register", {
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
		navigate("/login");
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
					<Typography href="/login">Already have an account?</Typography>
				</div>
			</div>
		</>
	);
}
