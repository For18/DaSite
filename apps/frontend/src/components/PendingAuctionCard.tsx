import { type Auction, type AuctionItem, type Product, type ProductImage, useAPI, type PublicUser } from "../lib/api";
import NotFound from "../routes/NotFound";
import Image from "./Image";
import styles from "./PendingAuctionCard.module.scss";
import Throbber from "./Throbber";
import Typography from "./Typography";
import { Routes } from "../routes/Routes"

export default function PendingAuctionCard({ auction }: { auction: Auction }) {
	const item = useAPI<AuctionItem>(Routes.AuctionItem.GetByAuction(auction.id));
	const user = useAPI<PublicUser>(Routes.User.GetPublic(auction.plannerId));
	const product = useAPI<Product>(item ? Routes.Product.Get(item.productId) : null);
	const thumbnailImage = useAPI<ProductImage[]>(product ? Routes.ProductImage.FromParent(product.id) : null);
	const thumbnailUrl = thumbnailImage && thumbnailImage[0] && thumbnailImage[0].url ?
		thumbnailImage[0].url :
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcCBHgbS23kyBw2r8Pquu19UtKZnrZmFUx1g&s";

	if (item === null) return <Throbber/>;
	if (item === undefined) return <NotFound/>;

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
						Asking price: €{item.startingPrice ? item.startingPrice / 100 : "NaN"},-
					</Typography>
					<Typography color="secondary" className={styles.infoText}>
						Amount: {item.startingPrice ? item.batchSize * item.count : "NaN"}
					</Typography>
				</div>
			</div>
		</div>
	);
}
