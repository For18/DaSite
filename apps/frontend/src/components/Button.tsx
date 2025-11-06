import { JSX, MouseEventHandler, PropsWithChildren } from "react";

export interface ButtonProps extends PropsWithChildren {
	variant?: "contained" | "outlined" | "text";
	onClick?: MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	color?: "brand" | "success" | "warning" | "error";
}

export default function Button({ onClick, children: content, disabled = false }: ButtonProps): JSX.Element {
	return <button onClick={e => {
		if (disabled) return;
		onClick?.(e);
	}} disabled={disabled}>{content}</button>;
}