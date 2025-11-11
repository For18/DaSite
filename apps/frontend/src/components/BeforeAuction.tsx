import Typography from "./Typography";
import styles from "./BeforeAuction.module.scss";

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
