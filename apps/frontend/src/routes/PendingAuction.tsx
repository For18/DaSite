import PendingAuctionCard from "../components/PendingAuctionCard";
import Section from "../components/Section";
import Throbber from "../components/Throbber";
import Typography from "../components/Typography";
import { type Auction, useAPI } from "../lib/api";
import { useScreenSize } from "../lib/util";
import styles from "./PendingAuction.module.scss";

export default function PendingAuction() {
	const auctions = useAPI<Auction[]>("/auctions/pending");

	const [screenWidth] = useScreenSize();

	return (
		<div className={styles.main}>
			<div className={styles.header}>
				<Typography heading={1}>Pending auctions</Typography>
			</div>

			<Section>
				<div className={styles["card-container"]} style={{
					display: auctions != null && auctions.length > 0 ? "grid" : "flex",
					gridTemplateColumns: screenWidth > 1000 ? "1fr 1fr" : "1fr",
				}}>
					{auctions == null ?
						<Throbber/> :
						auctions.length == 0 ?
						(
							<div className={styles["no-pending-auctions"]}>
								<Typography className={styles["no-pending-auctions-text"]}>No pending auctions</Typography>
							</div>
						) :
						auctions.map(auction => <PendingAuctionCard auction={auction} key={auction.id}/>)}
				</div>
			</Section>
		</div>
	);
}
