import styles from "./Footer.module.scss";
import Typography from "./Typography";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.top}>
					<Typography color="secondary">
						{"© "}
						{new Date().getFullYear()} For18
					</Typography>
				</div>
				<div className={styles.bottom}>
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
					<div className={styles.right}>
						<Typography href="">
							Locaties
						</Typography>
					</div>
				</div>
			</div>
		</footer>
	);
}
