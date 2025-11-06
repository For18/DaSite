import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Auction, Product, useAPI, User } from "../lib/api";
import styles from "./PendingAuctionCard.module.scss";

export default function PendingAuctionCard({ auction }: { auction: Auction }) {
	{
		/*
		const product = useAPI<Product>("/product/" + auction.productId);
		const user = useAPI<User>("/users/" + auction.plannerId);
		*/
	}

	const product = { id: 1, name: "Roses", description: "This is a sample product.", thumbnailImageId: "",
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
			<div className={styles.card}>
				<img className={styles.productImage} src="https://i.ibb.co/7xnxXSC6/matt.webp"/>
			</div>
			<div className={styles.infoCard}>
				<div className={styles.productNameContainer}>
					<Typography color="textPrimary" className={styles.productName}>{product?.name}</Typography>
				</div>
				<div className={styles.infoTextContainer}>
				<Typography color="textPrimary" className={styles.infoText}>Seller: {user?.displayName}</Typography>
				<Typography color="textPrimary" className={styles.infoText}>
					Asking price: €{auction.startingPrice},-
				</Typography>
				<Typography color="textPrimary" className={styles.infoText}>
					Amount: {auction.batchSize * auction.count}
				</Typography>
				</div>
			</div>
		</Card>
	);
}
