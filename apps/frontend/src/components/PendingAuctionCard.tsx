import Typography from "@mui/material/Typography";
import { Auction } from "../lib/api";

export default function PendingAuctionCard({ auction }: {
	auction: Auction;
}) {
	return (
		<div style={{
			backgroundColor: "red",
			width: "100%",
			aspectRatio: "4/1"
		}}>
			<div style={{
				float: "left",
				width: "21%",
				height: "9vw",
				backgroundColor: "blue",
				paddingLeft: "2%",
				paddingRight: "2%",
				alignContent: "center",
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}>
				<img src="https://i.ibb.co/7xnxXSC6/matt.webp" width={80} height={80}></img>
				{/* Insert product image here */}
			</div>
			<div style={{
				float: "right", 
				width: "70%",
				height: "9vw",
				paddingLeft: "5%",
				

			}}>
				<Typography color="textPrimary">Seller: </Typography>
				<Typography color="textPrimary">Asking price: {auction.startingPrice}</Typography>
				<Typography color="textPrimary">Amount: {auction.batchSize * auction.count}</Typography>
			</div>
		</div>
	);
}
