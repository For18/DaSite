import { Button, Typography } from "@mui/material";
import React from "react";
import styles from "./styles/Clock.module.scss";

// TODO: add onBuy callback
export default function Clock(
	{ progress, price, fmtedTime, wasAuctionEndedByUserRef }: { progress: number, price: string, fmtedTime: string,
		wasAuctionEndedByUserRef: React.RefObject<boolean> }
) {
	const currencyType = "100 cent";

	return (
		<div className={styles.container}>
			<div className={styles.clock} style={{ "--progress": progress } as React.CSSProperties}>
				<div className={styles["clock-overlay"]}>
					{/* Top Box*/}
					<div className={styles["clock-box currency"]}>
						<Typography>currency</Typography>
						<Typography>{currencyType}</Typography>
					</div>

					{/* Middle Box*/}
					<div className={styles["clock-box price"]}>
						<Typography>price</Typography>
						<Typography>{price}</Typography>
					</div>

					{/* Bottom Box*/}
					<div className={styles["clock-box count"]}>
						<Typography>count</Typography>
						<Typography>{6969}</Typography>
					</div>
				</div>
			</div>

			<Typography className={styles.typography}>
				{fmtedTime}
			</Typography>

			{/* TODO: make seperate pop up?? */}
			<Button
				className={styles["bid-button"]}
				disabled={progress < 0 || progress > 1}
				onClick={() => {
					wasAuctionEndedByUserRef.current = true;
					alert(`Auction bought for € ${price}`);
				}}
			>
				BUY
			</Button>
		</div>
	);
}
