import styles from "./Switch.module.scss";

export interface ToggleSwitchProps {
	enabled: boolean;
	onClick: () => void;
}

export function Switch({ enabled, onClick }: ToggleSwitchProps) {
	return (
		<div
			className={[
				styles.container,
				enabled ? styles.enabled : null
			].filter(v => v != null).join(" ")}
			aria-pressed={enabled}
			onClick={onClick}
		>
			<div className={styles.dot}></div>
		</div>
	);
}
