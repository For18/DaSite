import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Auction, Product, useAPI, User } from "../lib/api";

export default function PendingAuctionCard({ auction }: { auction: Auction }) {
	{
		/*
		const product = useAPI<Product>("/product/" + auction.productId);
		const user = useAPI<User>("/users/" + auction.plannerId);
		*/
	}

	const product = { id: 1, name: "Sample Product", description: "This is a sample product.", thumbnailImageId: "",
		ownerId: 3 };
	const user = { displayName: "John Doe", imageUrl: "", email: "blablabla", telephoneNumber: 123456789 };

	const cardAspectRatio = 4 / 1;

	return (
		<Card sx={{
			display: "flex",
			width: "100%",
			backgroundColor: "#88888811",
			aspectRatio: cardAspectRatio
		}}>
			<div style={{
				position: "relative",
				float: "left",
				width: "fit-content",
				height: "100%",
				alignContent: "center",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				objectFit: "contain"
			}}>
				<div style={{
					justifyContent: "center",
					alignContent: "center",
					display: "flex",
					position: "absolute",
					width: "100%",
					alignItems: "center"
				}}>
					<Typography color="textPrimary" style={{ position: "absolute" }}>{product?.name}</Typography>
				</div>
				<img src="https://i.ibb.co/7xnxXSC6/matt.webp" style={{
					height: "100%",
					aspectRatio: "1 / 1",
					objectFit: "cover",
					display: "block"
				}}/>
			</div>
			<div style={{
				float: "right",
				width: `${(cardAspectRatio - 1) / cardAspectRatio * 100}%`,
				height: "100%",
				paddingLeft: "3%",
				justifyContent: "center",
				flexDirection: "column",
				display: "flex"
			}}>
				<Typography color="textPrimary">Seller: {user?.displayName}</Typography>
				<Typography color="textPrimary">Asking price: €{auction.startingPrice},-</Typography>
				<Typography color="textPrimary">Amount: {auction.batchSize * auction.count}</Typography>
			</div>
		</Card>
	);
}
