import Typography from "@mui/material/Typography";
import { Auction, Product, User, useAPI } from "../lib/api";
import Card from "@mui/material/Card";

export default function PendingAuctionCard({ auction }: 
	{ auction: Auction; }){
		{/*
		const product = useAPI<Product>("/product/" + auction.productId);
		const user = useAPI<User>("/users/" + auction.plannerId);
		*/}

		const product = {id: 1, name: "Sample Product", description: "This is a sample product.", thumbnailImageId: "", ownerId: 3}
		const user = {displayName: "John Doe", imageUrl: "", email: "blablabla", telephoneNumber: 123456789}

	return (
		<Card sx={{
			display: "flex",
			backgroundColor: "green",
			maxWidth: "100%",
			aspectRatio: 4/1
		}}>
			<div style={{
				position: "relative",
				float: "left",
				width: "25%",
				height: "100%",
				backgroundColor: "blue",
				alignContent: "center",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				objectFit: "contain"
			}}>
				<div style={{justifyContent:"center", alignContent:"center", display: "flex", position: "absolute", width: "100%", alignItems: "center"}}>
						<Typography color="textPrimary" style={{position: "absolute"}}>{product?.name}</Typography>
				</div>
				<img src="https://i.ibb.co/7xnxXSC6/matt.webp" style={{width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block"}}>
				</img>
				
			</div>
			<div style={{
				float: "right",
				width: "72%",
				height: "100%",
				backgroundColor: "red",
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
