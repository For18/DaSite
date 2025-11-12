import styles from "./Footer.module.scss";
import Typography from "./Typography";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.left}>
				<Typography href="/auctions">
					Contactgegevens
				</Typography>
				<Typography href="/profile/1">
					Gebruikers
				</Typography>
				<Typography href="">
					Openingstijden
				</Typography>
			</div>
			<Typography color="secondary">
				{"© "}
				{new Date().getFullYear()} For18
			</Typography>
			<div className={styles.right}>
				<Typography href="">
					Locaties
				</Typography>
			</div>
		</footer>
	);
}
