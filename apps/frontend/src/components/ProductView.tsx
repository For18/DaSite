import Throbber from "../components/Throbber";
import { Product } from "../lib/api";
import { ProductImage, useAPI, User } from "../lib/api";
import NotFound from "../routes/NotFound";
import styles from "./ProductView.module.scss";
import Typography from "./Typography";
import Image from "./Image"

export default function ProductView({ product, batchSize }: { product: Product , batchSize: number}) {
	const owner = useAPI<User>("/user/" + product.ownerId) ?? null;
	const prodImages = useAPI<ProductImage[]>("/product-image/from/" + product.id);
	// const thumbnailImage = useAPI<ProductImage>(product ? "/product-image/" + product.thumbnailImageId : null);

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

  const ownerId = product.ownerId? product.ownerId.toString() : undefined;

	return (
		<div className={styles["product-view"]}>
			<div>
				<Typography heading={1}>{product.name}</Typography>
				<Typography className={styles.seller} href={`/profile/${ownerId}`}>
					Seller: {owner ? owner.displayName : "Seller not found"}
				</Typography>
			</div>

			<hr className={styles["horizontal-rule"]}/>

      <div>
        <Typography>Batch size: {batchSize}</Typography>
      </div>

			<hr className={styles["horizontal-rule"]}/>

			<div>
				<Typography>{product.description}</Typography>
			</div>

			{prodImages[0]?
				(
					<>
						<hr className={styles["horizontal-rule"]}/>
						<Image
							className={styles["thumbnail-image"]}
							src={prodImages[0].url}
							alt={product.name}
						/>
					</>
				) :
				null}

			<div className={styles["extra-image-container"]}>
				{prodImages.map(prodImage => prodImage.url).map((url, index) => (
					<div key={url}>
						<a href={url}>
							<Image
								className={styles["extra-image"]}
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

