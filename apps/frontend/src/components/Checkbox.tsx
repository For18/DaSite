import { useCallback } from "react";
import styles from "./Checkbox.module.scss";

export interface CheckboxProps {
	checked: boolean;
	onClick: () => void;
	labelledby?: string;
}

export default function Checkbox({ checked, onClick, labelledby }: CheckboxProps) {
	const onKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") onClick();
	}, [onClick]);

	return (
		<div onClick={onClick} onKeyDown={onKeyDown as any} aria-checked={checked} role="checkbox" tabIndex={0}
			aria-labelledby={labelledby} className={styles.container + (checked ? " " + styles.checked : "")}
		>
			<svg className={styles.svg} viewBox="-20 -20 130 130" role="none">
				<path d="M100 0 L50 90 L0 50" pathLength="1"/>
			</svg>
		</div>
	);
}
