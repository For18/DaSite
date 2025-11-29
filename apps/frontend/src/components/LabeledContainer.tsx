import { ReactNode } from "react";
import Typography from "./Typography";
import styles from "./LabeledContainer.module.scss";

export interface LabeledContainerProps {
	color?: "primary" | "secondary";
	text: string;
	children: ReactNode
}

export default function LabeledContainer({ color = "primary", text, children }: LabeledContainerProps) {
	return (
		<div className={styles.container}>
			{children}
			<Typography color={color}>{text}</Typography>
		</div>
	)
}