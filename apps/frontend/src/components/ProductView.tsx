import Throbber from "../components/Throbber";
import { Product } from "../lib/api";
import { ProductImage, useAPI, User } from "../lib/api";
import NotFound from "../routes/NotFound";
import Image from "./Image";
import styles from "./ProductView.module.scss";
import Typography from "./Typography";

export default function ProductView(
	{ product, showThumbnail = true, batchSize }: { product: Product, showThumbnail?: boolean, batchSize?: number }
) {
	const owner = useAPI<User>("/user/" + product.ownerId) ?? null;
	const prodImages = useAPI<ProductImage[]>("/product-image/from/" + product.id);
	// const thumbnailImage = useAPI<ProductImage>(
	// 	product && showThumbnail ? "/product-image/from/" + product.thumbnailImageId : null
	// );

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
				<Typography className={styles.seller} href={`/profile/${ownerId}`}>
					Seller: {owner ? owner.displayName : "Seller not found"}
				</Typography>
			</div>

			{batchSize == null ?
				null :
				(
					<div>
						<>
							<hr className={styles.horizontalRule}/>
							<Typography>Batch size: {batchSize}</Typography>
						</>
					</div>
				)}

			<hr className={styles.horizontalRule}/>

			<div>
				<Typography>{product.description}</Typography>
			</div>

			{prodImages[0].url && showThumbnail ?
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
				{prodImages.map(prodImage => prodImage.url).map((url, index) => (
					<div key={url}>
						<a href={url}>
							<Image
								className={styles.extraImage}
								src={url}
								alt={`Product Image ${index + 1}`}
							/>
						</a>
					</div>
				))}
			</div>
		</div>
	);
}
