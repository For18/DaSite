import React from "react";
import Button from "./Button";
import styles from "./Clock.module.scss";
import Typography from "./Typography";

const currencyType = "100 cent";

// TODO: add onBuy callback
export default function Clock(
	{ progress, price, fmtedTime, setWasAuctionEndedByUser }: { progress: number, price: string, fmtedTime: string,
		setWasAuctionEndedByUser: (value: boolean) => void }
) {
	return (
		<div className={styles.container}>
			<div className={styles.clock} style={{ "--progress": progress } as React.CSSProperties}>
				<div className={styles["clock-overlay"]}>
					{/* Top Box*/}
					<div className={styles["clock-box"]}>
						<Typography>currency</Typography>
						<Typography>{currencyType}</Typography>
					</div>

					{/* Middle Box*/}
					<div className={styles["clock-box"]}>
						<Typography>price</Typography>
						<Typography>{price}</Typography>
					</div>

					{/* Bottom Box*/}
					<div className={styles["clock-box"]}>
						<Typography>count</Typography>
						<Typography>{6969}</Typography>
					</div>
				</div>
			</div>

			<Typography className={styles.timer}>
				{fmtedTime}
			</Typography>

			{/* TODO: make seperate pop up?? */}
			<Button
				variant="outlined"
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
