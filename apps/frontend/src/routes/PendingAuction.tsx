import PendingAuctionCard from "@component/PendingAuctionCard";
import Section from "@component/Section";
import Throbber from "@component/Throbber";
import Typography from "@component/Typography";
import { type Auction, useAPI } from "@lib/api";
import { useScreenSize } from "@lib/util";
import styles from "./PendingAuction.module.scss";
import { Routes } from "@route/Routes";

/* TODO:
 * Add pure text page of pending auctions
 * [Auction] onClick => old PendingAuction page but only contains items that are sold in the current auction
 * optionally make every Product card clickable so it shows <ProductView>
 */
export default function PendingAuction() {
	const auctions = useAPI<Auction[]>(Routes.Auction.GetUpcoming);

	const [screenWidth] = useScreenSize();

	return (
		<div className={styles.main}>
			<div className={styles.header}>
				<Typography heading={1}>Pending auctions</Typography>
			</div>

			<Section>
				<div className={styles["card-container"]} style={{
					display: auctions != null && auctions.length > 0 ? "grid" : "flex",
					gridTemplateColumns: screenWidth > 1000 ? "1fr 1fr" : "1fr"
				}}>
					{auctions == null ?
						<Throbber/> :
						auctions.length == 0 ?
						(
							<div className={styles["no-pending-auctions"]}>
								<Typography className={styles["no-pending-auctions-text"]}>
									No pending auctions
								</Typography>
							</div>
						) :
						auctions.map(auction => <PendingAuctionCard auction={auction} key={auction.id}/>)}
				</div>
			</Section>
		</div>
	);
}
