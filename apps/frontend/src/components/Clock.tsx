import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

export default function AuctionClock({
	Auction: auction,
	color = "#00bfff",
	size = 400,
	totalTime = 10
}) {
	const [timeRemaining, setTimeRemaining] = useState(totalTime);
	const [colorStyle, setColorStyle] = useState(color);
	const [currentPrice, setCurrentPrice] = useState(auction.startingPrice);
	const [isAuctionOver, setIsAuctionOver] = useState(false);
	const [buttonText, setButtonText] = useState("DO NOT CLICK ME!!!");

	const timePercentage = timeRemaining / totalTime;
	const newPrice = (auction.minimumPrice +
		(auction.startingPrice - auction.minimumPrice) * (1 - Math.exp(-timeRemaining / totalTime))).toFixed(2);
	const getColor = (percentage: number) => {
		if (percentage > 0.5) return "#00bfff";
		if (percentage > 0.25) return "#ffa500";
		return "#ff0000";
	};

	useEffect(() => {
		if (!isAuctionOver) {
			setCurrentPrice(newPrice);
		} else {
			setButtonText("You already bought this auction.");
		}
	}, [timeRemaining, isAuctionOver]);

	useEffect(() => {
		if (timeRemaining <= 0 || isAuctionOver) return;

		const timer = setInterval(() => {
			setTimeRemaining(prev => Math.max(prev - 1, 0));
		}, 1000);

		return () => clearInterval(timer);
	}, [timeRemaining, isAuctionOver]);

	useEffect(() => {
		if (!isAuctionOver) {
			setColorStyle(getColor(timePercentage));
		}
	}, [timeRemaining, isAuctionOver]);

	const handleButtonClick = () => {
		setIsAuctionOver(true);
		alert(`You bought the auction for $${currentPrice}`);
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				textAlign: "center"
			}}
		>
			<div
				style={{
					width: size,
					height: size,
					borderRadius: "50%",
					backgroundColor: colorStyle,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					color: "white",
					fontWeight: "bold",
					fontSize: "1.5em",
					userSelect: "none",
					transition: "background-color 0.5s ease"
				}}
			>
				{timeRemaining} s
			</div>

			<Typography
				sx={{
					marginTop: "20px"
				}}
			>
				$ {currentPrice}
			</Typography>

			<Button
				onClick={handleButtonClick}
				color="primary"
				variant="contained"
				sx={{
					marginTop: "20px"
				}}
				disabled={isAuctionOver}
			>
				{buttonText} {}
			</Button>
		</div>
	);
}
