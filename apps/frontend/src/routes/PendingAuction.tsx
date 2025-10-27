import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Throbber from "../components/Throbber";
import { Auction, useAPI } from "../lib/api";
import { useScreenSize } from "../lib/util";

export default function PendingAuction() {
	const auctions = useAPI<Auction[]>("/auctions/pending");
	const [screenWidth, screenHeight] = useScreenSize();

	const minPaperHeight = 300;

	return (
		<Paper sx={{
			width: "800px",
			maxWidth: "80%",
			minHeight: `${minPaperHeight}px`,
			display: auctions != null && auctions.length > 0 ? "grid" : "flex",
			gridTemplateColumns: screenWidth > 1000 ? "1fr 1fr" : "1fr",
			justifyContent: "center",
			alignItems: "center",
			gap: "16px",
			padding: "16px"
		}}>
			{auctions == null ?
				<Throbber/> :
				auctions.length == 0 ?
				<Typography color="textPrimary">No pending auctions</Typography> :
				auctions.map(auction => (
					<div style={{
						backgroundColor: "red",
						width: "100%",
						aspectRatio: "4/1"
					}}/>
				))}
		</Paper>
	);
}
