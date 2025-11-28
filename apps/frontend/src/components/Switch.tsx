import { useCallback } from "react";
import styles from "./Switch.module.scss";

export interface ToggleSwitchProps {
	enabled: boolean;
	onClick: () => void;
}

export function Switch({ enabled, onClick }: ToggleSwitchProps) {
	const onKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") onClick();
	}, [onClick])

	return (
		<div
			className={[
				styles.container,
				enabled ? styles.enabled : null
			].filter(v => v != null).join(" ")}
			aria-pressed={enabled}
			role="switch"
			tabIndex={0}
			onClick={onClick}
			onKeyDown={onKeyDown as any}
		>
			<div className={styles.dot}/>
		</div>
	);
}
