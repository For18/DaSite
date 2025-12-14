import Typography from "./Typography";
import styles from "./StatusDisplay.module.scss";

// TODO: Add warning status?
export type StatusType = "none" | "progress" | "success" | "error";

export interface Status {
	type: StatusType;
	label: string;
}

export interface StatusDisplayProps {
	status: Status;
}

export function StatusDisplay({ status }: StatusDisplayProps) {
	return (
		<div className={styles.container + (status.type !== "none" && status.type !== "success" ? " " + styles.active : "")}>
			{
				status.type === "none" ?
					null
				: status.type === "success" ?
					<svg className={styles.successIcon} viewBox="-10 -10 120 120">
						<path d="M100 0 L50 100 L0 75" pathLength="1"/>
					</svg>
				: status.type === "progress" ?
					<svg className={styles.progressIcon} viewBox="-10 -10 120 120">
						<path d="M100 50 A50 50 0 0 0 50 0"/>
					</svg>
				: status.type === "error" ?
					<svg className={styles.errorIcon} viewBox="-10 -10 120 120">
						<path d="M0 0 L100 100"/>
						<path d="M100 0 L0 100"/>
					</svg>
				: null
			}
			<span className={styles.label}>{status.label}</span>
		</div>
	);
}