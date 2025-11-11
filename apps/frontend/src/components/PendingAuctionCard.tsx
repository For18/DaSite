import { Auction, Product, ProductImage, useAPI, User } from "../lib/api";
import styles from "./PendingAuctionCard.module.scss";
import Section from "./Section";
import Typography from "./Typography";

export default function PendingAuctionCard({ auction }: { auction: Auction }) {
	const product = useAPI<Product>("/product/" + auction.productId);
	const user = useAPI<User>("/user/" + auction.plannerId);
	const thumbnailImage = useAPI<ProductImage>(product ? "/product-image/from/" + product.thumbnailImageId : null);

	return (
		<Section flex={{
			direction: "row",
			justify: "space-between",
			align: "flex-start"
		}}>
			<div className={styles.card}>
				<img className={styles.productImage} src={thumbnailImage?.url}/>
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
		</Section>
	);
}
