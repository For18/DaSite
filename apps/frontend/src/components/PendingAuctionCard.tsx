import { type Auction, type Product, type ProductImage, useAPI, type User } from "../lib/api";
import Image from "./Image";
import styles from "./PendingAuctionCard.module.scss";
import Typography from "./Typography";

export default function PendingAuctionCard({ auction }: { auction: Auction }) {
	const product = useAPI<Product>("/product/" + auction.productId);
	const user = useAPI<User>("/user/" + auction.plannerId);
	const thumbnailImage = useAPI<ProductImage[]>(product ? "/product-image/from/" + product.id : null);
	const thumbnailUrl = thumbnailImage && thumbnailImage[0].url ?
		thumbnailImage[0].url :
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcCBHgbS23kyBw2r8Pquu19UtKZnrZmFUx1g&s";

	return (
		<div className={styles.card}>
			<div className={styles.image}>
				<Image className={styles.productImage} src={thumbnailUrl} alt={`Thumbnail van ${product?.name}`}/>
			</div>
			<div className={styles.infoCard}>
				<div className={styles.productNameContainer}>
					<Typography className={styles.productName}>{product?.name}</Typography>
				</div>
				<div className={styles.infoTextContainer}>
					<Typography color="secondary" className={styles.infoText}>
						Seller: {user?.userName}
					</Typography>
					<Typography color="secondary" className={styles.infoText}>
						Asking price: €{auction.startingPrice / 100},-
					</Typography>
					<Typography color="secondary" className={styles.infoText}>
						Amount: {auction.batchSize * auction.count}
					</Typography>
				</div>
			</div>
		</div>
	);
}
