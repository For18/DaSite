import { useEffect } from "react";
import ProductView from "../components/ProductView";
import Section from "../components/Section";
import Throbber from "../components/Throbber";
import Typography from "../components/Typography";
import { type Auction, type Product, useAPI } from "../lib/api";
import { formatEuros } from "../lib/util";

export default function Auctions() {
	useEffect(() => {
		document.title = "For18 - auctions";
	});

	const auctions = useAPI<Auction[]>("/auctions");
	const products = useAPI<Product[]>("/products");

	return (
		<>
			<Typography heading={1}>Live Auctions</Typography>

			<Section flex={{
				direction: "column"
			}}>
				{auctions === null ?
					<Throbber/> :
					auctions === undefined || auctions.length === 0 ?
					<Typography>No active auctions</Typography> :
					auctions.map(auction => {
						const product = products ? products.find(p => p.id === auction.productId) : undefined;

						return (
							<Section key={auction.id}>
								{product ?
									<ProductView product={product} showThumbnail={false}/> :
									<Typography>Product #{auction.productId}</Typography>}
								<Typography color="secondary">
									Price: {formatEuros(auction.startingPrice)} → {formatEuros(auction.minimumPrice)} • Count: {auction.count}
								</Typography>
							</Section>
						);
					})}
			</Section>
		</>
	);
}
