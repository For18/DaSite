import { Ref } from "react";
import styles from "./Input.module.scss";

export type InputType = "text" | "textfield" | "password" | "date" | "datetime-local" | "email" | "number" | "password"
	| "tel" | "text" | "time" | "url";

export interface InputProps {
	type: InputType;
	placeholder?: string;
	disabled?: boolean;
	labelledby?: string;
	value?: string;
	onChange?: (value: string) => void;
	onEnter?: () => void;
	inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement>;
	className?: string;
}

export default function Input(
	{ type, placeholder, disabled, labelledby, value, onChange, onEnter, inputRef, className }: InputProps
) {
	// NOTE: using a ternary to decide which type to cast 'inputRef' does not work for TypeScript's
	// it still complains hence the big and ugly code duplication
	if (type === "textfield") {
		return (
			<textarea
				ref={inputRef as Ref<HTMLTextAreaElement>}
				placeholder={placeholder}
				className={styles.input + (className ? " " + className : "")}
				disabled={disabled}
				aria-labelledby={labelledby}
				value={value}
				onChange={e => onChange?.(e.target.value)}
				onKeyDown={e => {
					if (e.key === "Enter") {
						e.preventDefault();
						onEnter?.();
					}
				}}
			/>
		);
	}

	return (
		<input
			ref={inputRef as Ref<HTMLInputElement>}
			type={type}
			placeholder={placeholder}
			className={styles.input + (className ? " " + className : "")}
			disabled={disabled}
			aria-labelledby={labelledby}
			value={value}
			onChange={e => onChange?.(e.target.value)}
			onKeyDown={e => {
				if (e.key === "Enter") {
					e.preventDefault();
					onEnter?.();
				}
			}}
		/>
	);
}
