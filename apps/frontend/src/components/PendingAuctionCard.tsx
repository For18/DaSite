import { type Auction, type Product, type ProductImage, useAPI, type User } from "../lib/api";
import Image from "./Image";
import styles from "./PendingAuctionCard.module.scss";
import Throbber from "./Throbber";
import Typography from "./Typography";
import Throbber from "./Throbber";

export default function PendingAuctionCard({ auction }: { auction: Auction }) {
	const auctions = useAPI<Auction[]>("/auctions/pending");
	const item = useAPI<AuctionItem>("/auction-item/get-by-auction/" + auction.id);
	const user = useAPI<User>("/user/" + auction.plannerId);
	const product = useAPI<Product>(item ? "/product/" + item.productId : null);
	const thumbnailImage = useAPI<ProductImage[]>(product ? "/product-image/from/" + product.id : null);
	const thumbnailUrl = thumbnailImage && thumbnailImage[0] && thumbnailImage[0].url ?
		thumbnailImage[0].url :
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcCBHgbS23kyBw2r8Pquu19UtKZnrZmFUx1g&s";

	if (item === null || auctions === null) return <Throbber/>;
	if (item === undefined || auctions === undefined) return <NotFound/>;

	return (
		<div className={styles.pendingList}>
			<Typography>
				{auctions.map(auction => (
					<div className={styles.card}>
						<div className={styles.image}>
							<Image className={styles.productImage} src={thumbnailUrl}
								alt={`Thumbnail van ${product?.name}`}/>
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
									Asking price: €{item.startingPrice ? item.startingPrice / 100 : "NaN"},-
								</Typography>
								<Typography color="secondary" className={styles.infoText}>
									Amount: {item.startingPrice ? item.batchSize * item.count : "NaN"}
								</Typography>
							</div>
						</div>
					</div>
				))}
			</Typography>
		</div>
	);
}
