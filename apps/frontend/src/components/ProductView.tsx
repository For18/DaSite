import Throbber from "../components/Throbber";
import { type ProductImage, type Product, type PublicUser, type AuctionItem, useAPI } from "../lib/api";
import NotFound from "../routes/NotFound";
import { Routes } from "../routes/Routes";
import Image from "./Image";
import styles from "./ProductView.module.scss";
import Typography from "./Typography";

export default function ProductView({ auctionItem }: { auctionItem: AuctionItem }) {
	const product = useAPI<Product>(Routes.Product.Get(auctionItem.productId));
	const owner = useAPI<PublicUser>(product?.id ? Routes.User.GetPublic(product.ownerId) : null);
	const prodImages = useAPI<ProductImage[]>(
		product?.id ? Routes.ProductImage.FromParent(product.id) + product.id : null
	);
	// const thumbnailImage = useAPI<ProductImage>(
	// 	product && showThumbnail ? "/product-image/from/" + product.thumbnailImageId : null
	// );

	if (product === null) return <Throbber/>;
	if (product === undefined) return <NotFound/>;

	if (owner === null) return <Throbber/>;
	if (owner === undefined) return <NotFound/>;

	if (prodImages === null) return <Throbber/>;
	if (prodImages === undefined) return <NotFound/>;

	// if (thumbnailImage === null) return <Throbber/>;
	// if (thumbnailImage === undefined) return <NotFound/>;
	//
	// console.log(thumbnailImage.url)

	// if (thumbnailImage.url === null) return <Throbber/>;
	// if (thumbnailImage.url === undefined) return <NotFound/>;

	const ownerId = product.ownerId ? product.ownerId.toString() : undefined;

	return (
		<div className={styles.productView}>
			<div>
				<Typography heading={1}>{product.name}</Typography>
				<Typography className={styles.seller} href={Routes.Pages.Profile(ownerId ?? 1)}>
					Seller: {owner ? owner.userName : "Seller not found"}
				</Typography>
			</div>

			<div>
				<hr className={styles.horizontalRule}/>
				<Typography>Item count: {auctionItem.count}</Typography>
				<Typography>Batch size: {auctionItem.batchSize}</Typography>
			</div>

			<hr className={styles.horizontalRule}/>

			<div>
				<Typography>{product.description}</Typography>
			</div>

			{prodImages && prodImages.length > 0 ?
				(
					<>
						<hr className={styles.horizontalRule}/>
						<Image
							className={styles.thumbnailImage}
							src={prodImages[0].url}
							alt={product.name}
						/>
					</>
				) :
				null}

			<div className={styles.extraImageContainer}>
				{Array.isArray(prodImages) ?
					prodImages.map(prodImage => prodImage.url).map((url, index) => (
						<div key={url}>
							<a href={url}>
								<Image
									className={styles.extraImage}
									src={url}
									alt={`Product Image ${index + 1}`}
								/>
							</a>
						</div>
					)) :
					null}
			</div>
		</div>
	);
}
