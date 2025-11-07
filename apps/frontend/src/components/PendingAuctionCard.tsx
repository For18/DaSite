import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Auction, Product, useAPI, User } from "../lib/api";
import styles from "./PendingAuctionCard.module.scss";

export default function PendingAuctionCard({ auction }: { auction: Auction }) {
	const product = useAPI<Product>("/product/" + auction.productId);
	const user = useAPI<User>("/user/" + auction.plannerId);

	const cardAspectRatio = 5 / 1;

	return (
		<Card sx={{
			minHeight: 90,
			display: "flex",
			width: "100%",
			backgroundColor: "#88888811",
			aspectRatio: cardAspectRatio
		}}>
			<div className={styles.card}>
				<img className={styles.productImage} src={product?.thumbnailImageUrl}/>
			</div>
			<div className={styles.infoCard}>
				<div className={styles.productNameContainer}>
					<Typography color="textPrimary" className={styles.productName}>{product?.name}</Typography>
				</div>
				<div className={styles.infoTextContainer}>
					<Typography color="textPrimary" className={styles.infoText}>
						Seller: {user?.displayName}
					</Typography>
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
