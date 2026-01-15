import PendingAuctionCard from "@/components/PendingItemCard";
import Section from "@component/Section";
import Throbber from "@component/Throbber";
import Typography from "@component/Typography";
import { type Auction, AuctionItem, useAPI } from "@lib/api";
import useScreenSize from "@lib/hooks/useScreenSize";
import { Routes } from "@route/Routes";
import { useEffect } from "react";
import styles from "./PendingItems.module.scss";

export default function PendingItems() {
	const items = useAPI<AuctionItem[]>(Routes.AuctionItem.GetPending);

	const [screenWidth] = useScreenSize();

	useEffect(() => {
		document.title = "For18 - Pending items";
	}, []);

	return (
		<div className={styles.main}>
			<div className={styles.header}>
				<Typography heading={1}>Pending items</Typography>
			</div>

			<Section>
				<div className={styles.cardContainer} style={{
					display: items != null && items.length > 0 ? "grid" : "flex",
					gap: "var(--spacing)",
					gridTemplateColumns: screenWidth > 1000 ? "1fr 1fr" : "1fr"
				}}>
					{items == null ?
						<Throbber/> :
						items.length == 0 ?
						(
							<div className={styles.noPendingAuctions}>
								<Typography className={styles.text}>
									No pending auctions
								</Typography>
							</div>
						) :
						items.map(item => <PendingAuctionCard item={item} key={item.id}/>)}
				</div>
			</Section>
		</div>
	);
}
