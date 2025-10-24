import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export default function Footer() {
	return (
		<footer
			style={{
				borderTop: "2px solid",
				borderColor: alpha("#888888", 0.1),
				padding: "1em",
				backgroundColor: alpha("#888888", 0.05)
			}}
		>
			<Typography variant="body2" color="textSecondary" align="center">
				{"© "}
				{new Date().getFullYear()} For18
			</Typography>
		</footer>
	);
}
