import { Auction, Product, ProductImage, useAPI, User } from "../lib/api";
import styles from "./PendingAuctionCard.module.scss";
import Section from "./Section";
import Typography from "./Typography";

export default function PendingAuctionCard({ auction }: { auction: Auction }) {
	const product = useAPI<Product>("/product/" + auction.productId);
	const user = useAPI<User>("/user/" + auction.plannerId);
	const thumbnailImage = useAPI<ProductImage>(product ? "/product-image/" + product.id : null);
	const thumbnailUrl = thumbnailImage?.url ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcCBHgbS23kyBw2r8Pquu19UtKZnrZmFUx1g&s";

	return (
		<div className={styles.card}>
			<div className={styles.image}>
				<img className={styles.productImage} src={thumbnailUrl} />
			</div>
			<div className={styles.infoCard}>
				<div className={styles.productNameContainer}>
					<Typography className={styles.productName}>{product?.name}</Typography>
				</div>
				<div className={styles.infoTextContainer}>
					<Typography color="secondary" className={styles.infoText}>
						Seller: {user?.displayName}
					</Typography>
					<Typography color="secondary" className={styles.infoText}>
						Asking price: €{auction.startingPrice},-
					</Typography>
					<Typography color="secondary" className={styles.infoText}>
						Amount: {auction.batchSize * auction.count}
					</Typography>
				</div>
			</div>
		</div>
	);
}
