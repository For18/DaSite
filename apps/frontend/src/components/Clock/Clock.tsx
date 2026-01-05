import Typography from "@component/Typography";
import type { CSSProperties } from "react";
import styles from "./Clock.module.scss";

const currencyType = "100 cent";

export default function Clock(
	{ progress, price, fmtedTime, count }: { progress: number, price: string, fmtedTime: string, count: number }
) {
	return (
		<div className={styles.container}>
			<div className={styles.clock} style={{ "--progress": progress } as CSSProperties}>
				<div className={styles.clockOverlay}>
					{/* Top Box*/}
					<div className={styles.clockBox}>
						<Typography>currency<br/>{currencyType}</Typography>
					</div>

					{/* Middle Box*/}
					<div className={styles.clockBox}>
						<Typography>price<br/>{price}</Typography>
					</div>

					{/* Bottom Box*/}
					<div className={styles.clockBox}>
						<Typography>count<br/>{count}</Typography>
					</div>
				</div>
			</div>

			<Typography className={styles.timer}>
				{fmtedTime}
			</Typography>
		</div>
	);
}
