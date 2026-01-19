import useAuth from "@/AuthProvider";
import Button from "@component/Button";
import Input from "@component/Input";
import { Status, StatusDisplay } from "@component/StatusDisplay";
import Typography from "@component/Typography";
import useGoto from "@lib/hooks/useGoto";
import { Routes } from "@route/Routes";
import { useEffect, useRef, useState } from "react";
import styles from "../AuthForm.module.scss";

export default function Login() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const goto = useGoto();
	const passwordRef = useRef<HTMLInputElement>(null);
	const { login, user } = useAuth();
	const [status, setStatus] = useState<Status>({ type: "none", label: "" });

	async function handleSubmit() {
		setStatus({
			type: "progress",
			label: "Logging in"
		});
		const status: number = await login(email, password);
		if (status === 401) {
			setStatus({
				type: "error",
				label: "Incorrect email/password"
			});
		} else if (status === 200) {
			setStatus({
				type: "success",
				label: "Success!"
			});
			goto(Routes.Pages.Home);
		}
	}

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
					<StatusDisplay status={status}/>
				</div>
			</div>
		</>
	);
}
