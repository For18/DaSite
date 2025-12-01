import { Ref } from "react";
import styles from "./Input.module.scss";

export type InputType = "text" | "password" | "date" | "datetime-local" | "email" | "number" | "password" | "tel"
	| "text" | "time" | "url";

export interface InputProps {
	type: InputType;
	ref?: Ref<HTMLInputElement>;
	placeholder?: string;
	disabled?: boolean;
	labelledby?: string;
	value?: string;
	onChange?: (value: string) => void;
}

export default function Input({ type, ref, placeholder, disabled, labelledby, value, onChange }: InputProps) {
	return (
		<input type={type} ref={ref} placeholder={placeholder} className={styles.input} disabled={disabled}
			aria-labelledby={labelledby} value={value} onChange={e => onChange?.(e.target.value)}/>
	);
}
