import { Ref } from "react";
import styles from "./Input.module.scss";

export type InputType = "text" | "textfield" | "password" | "date" | "datetime-local" | "email" | "number" | "password" | "tel"
	| "text" | "time" | "url";

export interface InputProps {
	type: InputType;
	ref?: Ref<HTMLInputElement>;
	placeholder?: string;
	disabled?: boolean;
	labelledby?: string;
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export default function Input(
	{ type, ref, placeholder, disabled, labelledby, value, onChange, className }: InputProps
) {
	const Element = type === "textfield" ? "textarea" : "input";
	if (type === "textfield") type = "text";
	return (
		<Element type={type} ref={ref} placeholder={placeholder}
			className={styles.input + (className != null ? " " + className : "")} disabled={disabled}
			aria-labelledby={labelledby} value={value} onChange={e => onChange?.(e.target.value)}/>
	);
}
