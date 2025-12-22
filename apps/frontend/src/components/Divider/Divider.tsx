import Typography from "@component/Typography";
import styles from "./Divider.module.scss";

export interface DividerProps {
	inset?: boolean;
	label?: string;
	"aria-hidden"?: boolean;
}

export default function Divider({ inset = false, label, "aria-hidden": hidden }: DividerProps) {
	return (
		<div role="seperator" aria-label={label} aria-hidden={hidden} className={[
			styles.root,
			inset ? styles.inset : null
		].filter(v => v != null).join(" ")}>
			<div className={styles.line}/>
			{label != null && <Typography color="secondary" className={styles.label}>{label}</Typography>}
			<div className={styles.line}/>
		</div>
	);
}
