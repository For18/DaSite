import { ReactNode } from "react";
import Typography from "./Typography";
import styles from "./LabeledContainer.module.scss";

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
			<Typography color={color} id={id}>{text}</Typography>
		</div>
	)
}