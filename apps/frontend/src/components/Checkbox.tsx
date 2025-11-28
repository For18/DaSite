import styles from "./Checkbox.module.scss";

export interface CheckboxProps {
	checked: boolean;
	onClick: () => void;
}

export default function Checkbox({ checked, onClick }: CheckboxProps) {
	return (
		<div onClick={onClick} aria-pressed={checked} role="checkbox" tabIndex={0} className={styles.container + (checked ? " " + styles.checked : "")}>
			<svg className={styles.svg} viewBox="-20 -20 130 130">
				<path d="M100 0 L50 90 L0 50"/>
			</svg>
		</div>
	)
}