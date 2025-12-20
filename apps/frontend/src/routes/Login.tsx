import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Input from "../components/Input";
import Typography from "../components/Typography";
import styles from "./AuthForm.module.scss";
import { Routes } from "./Routes";
import useAuth from "../AuthProvider";

export default function Login() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const navigate = useNavigate();
	const passwordRef = useRef<HTMLInputElement>(null);
  const { login, user } = useAuth();

	async function handleSubmit() {
    await login(email, password)
	}

  useEffect(() => {
      if (user) {
        console.log("Login successful!: ", user);
        navigate(Routes.Pages.Home);
      }
  }, [user])

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
