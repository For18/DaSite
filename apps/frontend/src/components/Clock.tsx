import { Button, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import "./styles/Clock.css";

export default function Clock(
	{ progress, price, fmtedTime, setIsAuctionOver }: { progress: number, price: string, fmtedTime: string , setIsAuctionOver: (value: boolean) => void }
) {
	const runningTxt = "BUY";
	const boughtTxt = "Auction Bought!";
	const overTxt = "Auction Over!";
	const currencyType = "100 cent";

  const isAuctionOver = progress >= 1;
	const [buttonText, setButtonText] = useState<string>("BUY");
	if (isAuctionOver && buttonText != runningTxt && buttonText != boughtTxt) setButtonText(overTxt);

	return (
		<div className={"container"}>
			<div className={"clock"} style={{ "--progress": progress } as React.CSSProperties}>
				<div className={"clock-overlay"}>
					{/* Top Box*/}
					<div className={"clock-box currency"}>
						<Typography>currency</Typography>
						<Typography>{currencyType}</Typography>
					</div>

					{/* Middle Box*/}
					<div className={"clock-box price"}>
						<Typography>price</Typography>
						<Typography>{price}</Typography>
					</div>

					{/* Bottom Box*/}
					<div className={"clock-box count"}>
						<Typography>count</Typography>
						<Typography>{6969}</Typography>
					</div>
				</div>
			</div>

			<Typography className={"typography"}>
				{fmtedTime}
			</Typography>

			<Button
				className={"bid-button"}
				disabled={progress < 0 || progress > 1}
				onClick={() => {
					setIsAuctionOver(true);
					setButtonText(boughtTxt);
					alert(`Auction bought for € ${price}`);
				}}
			>
				{buttonText}
			</Button>
		</div>
	);
}
