import type { JSX, MouseEventHandler, PropsWithChildren } from "react";
import styles from "./Button.module.scss";

export interface ButtonProps extends PropsWithChildren {
	variant?: "text" | "outlined" | "contained";
	onClick?: MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	color?: "brand" | "success" | "warning" | "error";
}

export default function Button(
	{ onClick, children: content, disabled = false, variant = "text", color = "brand" }: ButtonProps
): JSX.Element {
	return (
		<button className={[
			styles.button,
			styles[variant],
			styles[color]
		].join(" ")} onClick={e => {
			if (disabled) return;
			onClick?.(e);
		}} disabled={disabled}>
			{content}
		</button>
	);
}
