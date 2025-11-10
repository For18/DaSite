import { Typography } from "@mui/material";
import Throbber from "../components/Throbber";
import { Product } from "../lib/api";
import { ProductImage, useAPI, User } from "../lib/api";
import NotFound from "../routes/NotFound";
import styles from "./styles/ProductView.module.scss";

export default function ProductView({ product }: { product: Product }) {
	const owner = useAPI<User>("/user/" + product.owner) ?? null;
	const prodImages = useAPI<ProductImage[]>("/product-image/from/" + product.id);

	if (owner === null) return <Throbber/>;
	if (owner === undefined) return <NotFound/>;

	if (prodImages === null) return <Throbber/>;
	if (prodImages === undefined) return <NotFound/>;

	product.imageUrls = prodImages.map(prodImage => prodImage.url);

	return (
		<div className={styles["product-view"]}>
			<div>
				<Typography color="textPrimary">{product.name}</Typography>
				<Typography className={styles.seller} color="textPrimary">
					Seller: {owner ? owner.displayName : "Seller not found"}
				</Typography>
			</div>

			<hr className={styles["horizontal-rule"]}/>

			<div>
				<p>{product.description}</p>
			</div>

			<hr className={styles["horizontal-rule"]}/>

      {
        product.thumbnailImageUrl
			  ?   <div>
			      	<img
			      		className={styles["thumbnail-image"]}
			      		src={product.thumbnailImageUrl}
			      		alt={product.name}
			      	/>
			      </div>
        : null
      }

			<div className={styles["extra-image-container"]}>
				{product.imageUrls.map((url, index) => (
					<div key={url}>
            <a href={url}>
						  <img
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
