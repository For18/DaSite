import styles from "./BeforeAuction.module.scss";
import Typography from "@component/Typography";

export default function BeforeAuction({ startingPoint }: { startingPoint?: string }) {
	return (
		<div className={styles.container}>
			{startingPoint ?
				(
					<Typography heading={2}>
						Next item in: {startingPoint}
					</Typography>
				) :
				null}
		</div>
	);
}
