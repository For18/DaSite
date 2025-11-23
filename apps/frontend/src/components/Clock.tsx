import React from "react";
import styles from "./Clock.module.scss";
import Typography from "./Typography";

const currencyType = "100 cent";

export default function Clock(
	{ progress, price, fmtedTime, count}
  : { progress: number, price: string, fmtedTime: string, count: number }) {
	return (
		<div className={styles.container}>
			<div className={styles.clock} style={{ "--progress": progress } as React.CSSProperties}>
				<div className={styles.clockOverlay}>
					{/* Top Box*/}
					<div className={styles.clockBox}>
						<Typography>currency</Typography>
						<Typography>{currencyType}</Typography>
					</div>

					{/* Middle Box*/}
					<div className={styles.clockBox}>
						<Typography>price</Typography>
						<Typography>{price}</Typography>
					</div>

					{/* Bottom Box*/}
					<div className={styles.clockBox}>
						<Typography>count</Typography>
						<Typography>{count}</Typography>
					</div>
				</div>
			</div>

			<Typography className={styles.timer}>
				{fmtedTime}
			</Typography>

		</div>
	);
}
