import { useEffect } from "react";
import ProductView from "../components/ProductView";
import styles from "./Auctions.module.scss";
import Section from "../components/Section";
import Throbber from "../components/Throbber";
import Typography from "../components/Typography";
import { Auction, Product, useAPI } from "../lib/api";
import { formatEuros, normalizeTimestamp } from "../lib/util";

export default function Auctions() {
	useEffect(() => {
		document.title = "For18 - auctions";
	});

	const auctions = useAPI<Auction[]>("/auctions");
	const products = useAPI<Product[]>("/products");

	return (
		<>
			<Typography heading={1}>Live Auctions</Typography>

			<Section className={styles.container}>
				{auctions === null ?
					<Throbber /> :
					auctions === undefined || auctions.length === 0 ?
						<Typography>No active auctions</Typography> :
						(() => {
							const liveAuctions = auctions ? auctions.filter(auc => {
								const now = Date.now();
								const start = normalizeTimestamp(auc.startingTime ?? 0);
								const end = start + (auc.length ?? 0) * 1000;
								return start <= now && now < end;
							}) : [];

							if (liveAuctions.length === 0) return <Typography>No active auctions</Typography>;

							return liveAuctions.map(auction => {
								const product = products ? products.find(p => p.id === auction.productId) : undefined;

								return (
									<Section key={auction.id} className={styles.panel}>
										<div onClick={() => {
											window.location.href = `/clock/${auction.id}`;
										}} className="clickable">
											{product ?
												<ProductView product={product} /> :
												<Typography>Product #{auction.productId}</Typography>}
											<Typography color="secondary">
												Price: {formatEuros(auction.startingPrice)}{" "}
												→ {formatEuros(auction.minimumPrice)} • Count: {auction.count}  • batch size: {auction.batchSize}
											</Typography>
											<Typography color="secondary">
												Ends at: {new Date(
													(normalizeTimestamp(auction.startingTime ?? 0) + (auction.length ?? 0) * 1000)
												).toLocaleString()}
											</Typography>

											<Typography>Click to view auction clock</Typography>

										</div>
									</Section>
								);
							});
						})()}
			</Section>
		</>
	);
}
