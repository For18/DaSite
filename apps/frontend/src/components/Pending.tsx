import { Typography } from "@mui/material";
import styles from "./Pending.module.scss";

export default function Pending({ description, startingPoint }: { description: string, startingPoint?: string }) {
	return (
		<div className={styles.container}>
			<Typography className={styles.title} color="textPrimary">
				Pending...
			</Typography>

			<Typography className={styles.description} color="textPrimary">
				{description}
			</Typography>

			{startingPoint ?
				(
					<Typography className={styles["starting-point"]} color="textPrimary">
						Starting point: {startingPoint}
					</Typography>
				) :
				null}
		</div>
	);
}
