import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Header from "../components/Header";
import PendingAuctionCard from "../components/PendingAuctionCard";
import Throbber from "../components/Throbber";
import { Auction, Product, useAPI, User } from "../lib/api";
import { useScreenSize } from "../lib/util";
import styles from "./PendingAuction.module.scss";

export default function PendingAuction() {
	const auctions = useAPI<Auction[]>("/auctions");

	const [screenWidth, screenHeight] = useScreenSize();

	const minPaperHeight = 196;

	return (
		<div className={styles.main}>
			<div className={styles.header}>
				<Header>Pending auctions</Header>
			</div>

			<Paper sx={{
				width: "1000px",
				maxWidth: "80vw",
				height: "fit-content",
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
						<div className={styles.noPendingAuctions}>
							<Typography color="textPrimary" className={styles.noPendingAuctionsText}>No pending auctions</Typography>
						</div>
					) :
					auctions.map(auction => <PendingAuctionCard auction={auction} key={auction.id}/>)}
			</Paper>
		</div>
	);
}
