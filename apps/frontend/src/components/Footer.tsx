import Typography from "./Typography";
import styles from "./Footer.module.scss";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<Typography color="secondary" align="center">
				{"© "}
				{new Date().getFullYear()} For18
			</Typography>
		</footer>
	);
}
