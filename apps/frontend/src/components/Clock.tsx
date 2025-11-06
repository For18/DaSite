import { Typography, Button } from "@mui/material";
import React from "react";
import { useState } from "react";
import { AuctionState } from "../routes/ClockPage";
import "./styles/Clock.css";

export default function Clock(
	{ auctionState, setIsAuctionOver }: { auctionState: AuctionState, setIsAuctionOver: (value :boolean) => void }
) {

  const runningTxt = "BUY";
  const boughtTxt = "Auction Bought!";
  const overTxt = "Auction Over!";
  const currencyType = "100 cent";
  
  const [buttonText, setButtonText] = useState<string>("BUY");
  if (auctionState.isOver && buttonText != runningTxt && buttonText != boughtTxt) setButtonText(overTxt);
  
	return (
		<div className={"container"}>
			<div className={"clock"} style={{ "--progress": auctionState.progress } as React.CSSProperties}>
		    <div className={"clock-overlay"}>

	        {/* Top Box*/}
	        <div className={"clock-box currency"}>
		        <Typography>currency</Typography>
		        <Typography>{currencyType}</Typography>
	        </div>

	        {/* Middle Box*/}
	        <div className={"clock-box price"}>
		        <Typography>price</Typography>
		        <Typography>{auctionState.price}</Typography>
	        </div>

	        {/* Bottom Box*/}
	        <div className={"clock-box count"}>
		        <Typography>count</Typography>
		        <Typography>{6969}</Typography>
	        </div>
		    </div>
			</div>

			<Typography className={"typography"}>
				{auctionState.fmtedRemainingTime}
			</Typography>

      <Button 
        className={"bid-button"} 
        disabled={auctionState.progress < 0 || auctionState.progress > 1}
        onClick={() =>
          {
            setIsAuctionOver(true);
            setButtonText(boughtTxt);
            alert(`Auction bought for € ${auctionState.price}`);
          }}
          >
        {buttonText}
      </Button>
		</div>
	);
}
