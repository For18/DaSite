import { Button, Typography } from "@mui/material";
import React from "react";
import styles from "./Clock.module.scss";

const currencyType = "100 cent";

// TODO: add onBuy callback
export default function Clock(
	{ progress, price, fmtedTime, setWasAuctionEndedByUser}: { progress: number, price: string, fmtedTime: string,
    setWasAuctionEndedByUser: (value :boolean) => void }
) {

	return (
		<div className={styles.container}>
			<div className={styles.clock} style={{ "--progress": progress } as React.CSSProperties}>
				<div className={styles["clock-overlay"]}>
					{/* Top Box*/}
					<div className={styles["clock-box currency"]}>
						<Typography color="textPrimary">currency</Typography>
						<Typography color="textPrimary">{currencyType}</Typography>
					</div>

					{/* Middle Box*/}
					<div className={styles["clock-box price"]}>
						<Typography color="textPrimary">price</Typography>
						<Typography color="textPrimary">{price}</Typography>
					</div>

					{/* Bottom Box*/}
					<div className={styles["clock-box count"]}>
						<Typography color="textPrimary">count</Typography>
						<Typography color="textPrimary">{6969}</Typography>
					</div>
				</div>
			</div>

			<Typography className={styles.typography} color="textPrimary">
				{fmtedTime}
			</Typography>

			{/* TODO: make seperate pop up?? */}
			<Button
				className={styles["bid-button"]}
				disabled={progress < 0 || progress > 1}
				onClick={() => {
					setWasAuctionEndedByUser(true);
					alert(`Auction bought for € ${price}`);
				}}
			>
				BUY
			</Button>
		</div>
	);
}
