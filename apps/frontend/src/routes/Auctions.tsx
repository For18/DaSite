import { useEffect } from "react";
import ProductView from "../components/ProductView";
import Section from "../components/Section";
import Throbber from "../components/Throbber";
import Typography from "../components/Typography";
import { Auction, Product, useAPI } from "../lib/api";

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
									<ProductView product={product}/> :
									<Typography>Product #{auction.productId}</Typography>}
								<Typography color="secondary">
									Start: {auction.startingPrice} • Min: {auction.minimumPrice} • Count:{" "}
									{auction.count}
								</Typography>
							</Section>
						);
					})}
			</Section>
		</>
	);
}
