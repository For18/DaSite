import useAuth from "@/AuthProvider";
import Button from "@component/Button";
import Input from "@component/Input";
import Typography from "@component/Typography";
import { Routes } from "@route/Routes";
import { useEffect, useRef, useState } from "react";
import styles from "../AuthForm.module.scss";
import useGoto from "@lib/hooks/useGoto";

export default function Login() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const goto = useGoto();
	const passwordRef = useRef<HTMLInputElement>(null);
	const { login, user } = useAuth();

	async function handleSubmit() {
		await login(email, password);
	}

	useEffect(() => {
		if (user) {
			console.log("Login successful!");
			goto(Routes.Pages.Home);
		}
	}, [user]);

	useEffect(() => {
		document.title = "For18 - Login";
	});

	return (
		<>
			<div className={styles.imageBackground}>
				<div className={styles.container}>
					<Typography heading={1}>Login</Typography>
					<Input type="email" placeholder="email" value={email} onChange={setEmail}
						onEnter={() => passwordRef.current?.focus()}/>
					<Input type="password" placeholder="password" value={password} onChange={setPassword}
						inputRef={passwordRef} onEnter={handleSubmit}/>
					<Button onClick={handleSubmit}>Login</Button>
					<Typography href="/forgotpassword">Forgot password?</Typography>
					<Typography href={Routes.Pages.Register}>Don't have an account yet?</Typography>
				</div>
			</div>
		</>
	);
}
