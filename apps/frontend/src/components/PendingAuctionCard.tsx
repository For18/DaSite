import Typography from "@mui/material/Typography";
import { Auction } from "../lib/api";

export default function PendingAuctionCard({ auction }: {
	auction: Auction;
}) {
	return (
		<div style={{
			display: "flex",
			width: "100%",
			height: "142px",
			backgroundColor: "green",
			maxWidth: "100%"
		}}>
			<div style={{
				float: "left",
				width: "36%",
				height: "100%",
				backgroundColor: "blue",
				alignContent: "center",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				objectFit: "contain"
			}}>
				<img src="https://i.ibb.co/7xnxXSC6/matt.webp" width={"90%"} height={"90%"}></img>
				{/* Insert product image here */}
			</div>
			<div style={{
				float: "right",
				width: "61%",
				height: "100%",
				backgroundColor: "red",
				paddingLeft: "3%",
				justifyContent: "center",
				flexDirection: "column",
				display: "flex"
			}}>
				<Typography color="textPrimary">Seller:</Typography>
				<Typography color="textPrimary">Asking price: {auction.startingPrice}</Typography>
				<Typography color="textPrimary">Amount: {auction.batchSize * auction.count}</Typography>
			</div>
		</div>
	);
}
