import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PendingAuctionCard from "../components/PendingAuctionCard";
import Throbber from "../components/Throbber";
import { Auction, useAPI } from "../lib/api";
import { useScreenSize } from "../lib/util";

export default function PendingAuction() {
	{/*const auctions = useAPI<Auction[]>("/auctions/pending");*/}
	const [screenWidth, screenHeight] = useScreenSize();
	const auctions = [
		{ id: 1, count: 10, batchSize: 5, startingPrice: 100, minimumPrice: 20, startingTime: 50, productId: 1,
			plannerId: 1 },
		{ id: 2, count: 9, batchSize: 5, startingPrice: 500, minimumPrice: 20, startingTime: 50, productId: 2,
			plannerId: 2 },
		{ id: 3, count: 8, batchSize: 5, startingPrice: 300, minimumPrice: 20, startingTime: 50, productId: 3,
			plannerId: 3 },
		{ id: 2, count: 9, batchSize: 5, startingPrice: 500, minimumPrice: 20, startingTime: 50, productId: 2,
			plannerId: 2 },
		{ id: 3, count: 8, batchSize: 5, startingPrice: 300, minimumPrice: 20, startingTime: 50, productId: 3,
			plannerId: 3 },
		{ id: 2, count: 9, batchSize: 5, startingPrice: 500, minimumPrice: 20, startingTime: 50, productId: 2,
			plannerId: 2 },
		{ id: 3, count: 8, batchSize: 5, startingPrice: 300, minimumPrice: 20, startingTime: 50, productId: 3,
			plannerId: 3 },
		{ id: 2, count: 9, batchSize: 5, startingPrice: 500, minimumPrice: 20, startingTime: 50, productId: 2,
			plannerId: 2 },
		{ id: 3, count: 8, batchSize: 5, startingPrice: 300, minimumPrice: 20, startingTime: 50, productId: 3,
			plannerId: 3 }
	];

	const minPaperHeight = 300;

	return (
		<div style={{
			display: "flex",
			flexDirection: "column",
			alignItems: "center"
		}}>
			<h1>Pending products</h1>
			<Paper sx={{
				width: "800px",
				maxWidth: "80vw",
				minHeight: `${minPaperHeight}px`,
				display: auctions != null && auctions.length > 0 ? "grid" : "flex",
				gridTemplateColumns: screenWidth > 1000 ? "1fr 1fr" : "1fr",
				justifyContent: "center",
				alignItems: "flex-start",
				gap: "16px",
				padding: "16px",
				marginBottom: "32px"
			}}>
				{auctions == null ?
					<Throbber/> :
					auctions.length == 0 ?
					(
						<div style={{
							alignItems: "center",
							display: "flex",
							justifyContent: "center",
							minHeight: `${minPaperHeight}px`
						}}>
							<Typography color="textPrimary">No pending auctions</Typography>
						</div>
					) :
					auctions.map(auction => <PendingAuctionCard auction={auction}/>)}
				{
					/*
				{test == null ?
					<Throbber/> :
					test.length == 0 ?
					<Typography color="textPrimary">No pending auctions</Typography> :
					test?.map(testing => <PendingAuctionCard testing={testing}/>)}
				*/
				}
			</Paper>
		</div>
	);
}
