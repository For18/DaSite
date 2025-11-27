import type { CSSProperties } from "react";
import Button from "./Button";
import styles from "./Clock.module.scss";
import Typography from "./Typography";

const currencyType = "100 cent";

// TODO: add onBuy callback
export default function Clock(
	{ progress, price, fmtedTime, count, setWasAuctionEndedByUser }: { progress: number, price: string,
		fmtedTime: string, count: number, setWasAuctionEndedByUser: (value: boolean) => void }
) {
	return (
		<div className={styles.container}>
			<div className={styles.clock} style={{ "--progress": progress } as CSSProperties}>
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
