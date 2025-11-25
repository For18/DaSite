import { type Auction, type Product, type ProductImage, useAPI, type User } from "../lib/api";
import Image from "./Image";
import styles from "./PendingAuctionCard.module.scss";
import Typography from "./Typography";
import Throbber from "./Throbber";

export default function PendingAuctionCard({ auction }: { auction: Auction }) {
	const item = useAPI<AuctionItem>("/auction-item/get-by-auction/" + auction.id);
	const user = useAPI<User>("/user/" + auction.plannerId);
  const product = useAPI<Product>(item ? "/product/" + item.productId : null);
	const thumbnailImage = useAPI<ProductImage[]>(product ? "/product-image/from/" + product.id : null);
	const thumbnailUrl = thumbnailImage && thumbnailImage[0].url ?
		thumbnailImage[0].url :
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcCBHgbS23kyBw2r8Pquu19UtKZnrZmFUx1g&s";

  if (item === null) return <Throbber/>;
  if (item === undefined) return null;
  
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
						Asking price: €{item.startingPrice / 100},-
					</Typography>
					<Typography color="secondary" className={styles.infoText}>
						Amount: {item.batchSize * item.count}
					</Typography>
				</div>
			</div>
		</div>
	);
}
