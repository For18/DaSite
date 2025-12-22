import Typography from "@component/Typography";
import styles from "./Footer.module.scss";

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
					<div className={styles.field}>
						<div className={styles.textBlock}>
							<Typography href="/contact">
								Contact
							</Typography>
						</div>
					</div>
					<div className={styles.field}>
						<div className={styles.textBlock}>
							<Typography href="/locaties">
								Locations
							</Typography>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
