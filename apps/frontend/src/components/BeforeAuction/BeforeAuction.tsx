import Typography from "@component/Typography";
import styles from "./BeforeAuction.module.scss";

function formatStartCountDown(remainingTimeMs: number) {
	if (remainingTimeMs <= 0) remainingTimeMs = 0;
	const seconds = Math.floor(remainingTimeMs / 1000) % 60;
	const minutes = Math.floor(remainingTimeMs / 60000) % 60;
	const hours = Math.floor(remainingTimeMs / 3600000);

	if (minutes >= 1) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

	return (remainingTimeMs / 1000).toFixed(2);
}

export default function BeforeAuction({ remainingTimeMs }: { remainingTimeMs?: number }) {
	return (
		<div className={styles.container}>
			{remainingTimeMs ?
				(
					<Typography heading={2}>
						Next item in: {formatStartCountDown(remainingTimeMs)}
					</Typography>
				) :
				null}
		</div>
	);
}
