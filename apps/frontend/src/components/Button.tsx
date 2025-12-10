import type { JSX, MouseEventHandler, PropsWithChildren } from "react";
import styles from "./Button.module.scss";

export interface ButtonProps extends PropsWithChildren {
	variant?: "text" | "outlined" | "contained";
	onClick?: MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	color?: "brand" | "success" | "warning" | "error";
	className?: string;
	labelledby?: string;
}

export default function Button(
	{ onClick, children: content, disabled = false, variant = "text", color = "brand", className, labelledby }: ButtonProps
): JSX.Element {
	return (
		<button className={[
			styles.button,
			styles[variant],
			styles[color],
			className
		].filter(entry => entry !== null).join(" ")} onClick={e => {
			if (disabled) return;
			onClick?.(e);
		}} disabled={disabled} aria-labelledby={labelledby}>
			{content}
		</button>
	);
}
