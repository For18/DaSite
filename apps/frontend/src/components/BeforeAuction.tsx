import styles from "./BeforeAuction.module.scss";
import Typography from "./Typography";

export default function BeforeAuction({ startingPoint }: { startingPoint?: string }) {
	return (
		<div className={styles.container}>
			{startingPoint ?
				(
					<Typography>
						Starting in: {startingPoint}
					</Typography>
				) :
				null}
		</div>
	);
}
