import { type ReactNode } from "react";
import styles from "./LabeledContainer.module.scss";
import Typography from "../Typography";

export interface LabeledContainerProps {
	color?: "primary" | "secondary";
	text: string;
	children: ReactNode;
	id?: string;
}

export default function LabeledContainer({ color = "primary", text, children, id }: LabeledContainerProps) {
	return (
		<div className={styles.container}>
			{children}
			<Typography color={color} id={id} className={styles.label}>{text}</Typography>
		</div>
	);
}
