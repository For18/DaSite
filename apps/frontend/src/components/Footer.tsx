import Typography from "@mui/material/Typography";
import styles from "./Footer.module.scss";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<Typography variant="body2" color="textSecondary" align="center">
				{"© "}
				{new Date().getFullYear()} For18
			</Typography>
		</footer>
	);
}
