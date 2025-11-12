import styles from "./Footer.module.scss";
import Typography from "./Typography";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.left}>
				<Typography>
					Contactgegevens
				</Typography>
				<Typography>
					Gebruikers
				</Typography>
				<Typography>
					Openingstijden
				</Typography>
			</div>
			<Typography color="secondary">
				{"© "}
				{new Date().getFullYear()} For18
			</Typography>
			<div className={styles.right}>
				<Typography>
					Locaties
				</Typography>
			</div>
		</footer>
	);
}
