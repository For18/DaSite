import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Auction, Product, useAPI, User } from "../lib/api";
import "./PendingAuctionCard.scss";

export default function PendingAuctionCard({ auction }: { auction: Auction }) {
	{
		/*
		const product = useAPI<Product>("/product/" + auction.productId);
		const user = useAPI<User>("/users/" + auction.plannerId);
		*/
	}

	const product = { id: 1, name: "Sample Product", description: "This is a sample product.", thumbnailImageId: "",
		ownerId: 3 };
	const user = { displayName: "John Crow", imageUrl: "", email: "blablabla", telephoneNumber: 123456789 };

	const cardAspectRatio = 4 / 1;

	return (
		<Card sx={{
			display: "flex",
			width: "100%",
			backgroundColor: "#88888811",
			aspectRatio: cardAspectRatio
		}}>
			<div className="card">
				<img className="product-image" src="https://i.ibb.co/7xnxXSC6/matt.webp"/>
			</div>
			<div className="info-card">
				<Typography color="textPrimary" className="product-name">{product?.name}</Typography>
				<Typography color="textPrimary" className="info-text">Seller: {user?.displayName}</Typography>
				<Typography color="textPrimary" className="info-text">
					Asking price: €{auction.startingPrice},-
				</Typography>
				<Typography color="textPrimary" className="info-text">
					Amount: {auction.batchSize * auction.count}
				</Typography>
			</div>
		</Card>
	);
}
