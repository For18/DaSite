import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import Header from "../components/Header";
import Box from "@mui/material/Box";
import ProductView from "../components/ProductView";
import Throbber from "../components/Throbber";
import { useAPI, Auction, Product } from "../lib/api";

export default function Auctions() {
	useEffect(() => {
		document.title = "For18 - auctions";
	});

	const auctions = useAPI<Auction[]>('/auctions');
	const products = useAPI<Product[]>('/products');

	if (auctions === null) {
		// still loading
		return (
			<>
				<Header level={1} color="textPrimary">Live Auctions</Header>
				<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
					<Throbber />
				</Box>
			</>
		);
	}

	if (auctions === undefined || auctions.length === 0) {
		return (
			<>
				<Header level={1} color="textPrimary">Live Auctions</Header>
				<Typography color="textPrimary">No active auctions</Typography>
			</>
		);
	}

	return (
		<>
			<Header level={1} color="textPrimary">Live Auctions</Header>

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
				{auctions.map((auction) => {
					const product = products ? products.find(p => p.id === auction.productId) : undefined;

					return (
						<Box
							key={auction.id}
							sx={{
								minWidth: 220,
								flex: '1 1 220px',
								backgroundColor: '#262626',
								p: 2,
								borderRadius: 1
							}}
						>
							{product ? (
								<ProductView product={product} />
							) : (
								<Typography color="textPrimary">Product #{auction.productId}</Typography>
							)}
							<Typography color="textSecondary" variant="caption">
								Start: {auction.startingPrice} • Min: {auction.minimumPrice} • Count: {auction.count}
							</Typography>
						</Box>
					);
				})}
			</Box>
		</>
	);
}
