import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Input from "../components/Input";
import Typography from "../components/Typography";
import { API_URL } from "../lib/api";
import styles from "./AuthForm.module.scss";
import { Routes } from "./Routes";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const res = await fetch(API_URL + Routes.Identity.PostLogin + "?useCookies=true", {
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
    const { works, httpStatus, data } = await login(email, password);

    if (!works) {
      console.error("Registration failed:", httpStatus, data);
      return;
    }

    console.log("Login successful:", httpStatus, data);
    navigate("/");
  }

  useEffect(() => {
    document.title = "For18 - Login";
  });

  return (
    <>
      <div className={styles.imageBackground}>
        <div className={styles.container}>
          <Typography heading={1}>Login</Typography>
          <Input type="email" placeholder="email" value={email} onChange={setEmail} />
          <Input type="password" placeholder="password" value={password} onChange={setPassword} />
          <Button onClick={handleSubmit}>Login</Button>
          <Typography href="/forgotpassword">Forgot password?</Typography>
          <Typography href="/register">Don't have an account yet?</Typography>
        </div>
      </div>
    </>
  );
}
