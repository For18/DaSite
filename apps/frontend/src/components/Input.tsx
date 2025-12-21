import { Ref, useCallback } from "react";
import styles from "./Input.module.scss";

export type InputType = "text" | "textfield" | "password" | "date" | "datetime-local" | "email" | "number" | "password"
	| "tel" | "text" | "time" | "url";

export interface InputProps {
	type: InputType;
	placeholder?: string;
	disabled?: boolean;
	labelledby?: string;
	id?: string;
	value?: string;
	onChange?: (value: string) => void;
	onEnter?: () => void;
	inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement>;
	className?: string;
}

export default function Input(
	{ type, placeholder, disabled, labelledby, value, onChange, onEnter, inputRef, className }: InputProps
) {
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			onChange?.(e.target.value);
		},
		[onChange]
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			if (e.key === "Enter") {
				e.preventDefault();
				onEnter?.();
			}
		},
		[onEnter]
	);
	const Element = type === "textfield" ? "textarea" : "input";
	if (type === "textfield") type = "text";
	return (
		<Element
			ref={inputRef as any}
			type={type}
			placeholder={placeholder}
			className={styles.input + (className != null ? " " + className : "")}
			disabled={disabled}
			aria-labelledby={labelledby}
			value={value}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
		/>
	);
}
