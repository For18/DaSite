import { Typography } from "@mui/material";
import Throbber from "../components/Throbber";
import { Product } from "../lib/api";
import { ProductImage, useAPI, User } from "../lib/api";
import NotFound from "../routes/NotFound";
import styles from "./styles/ProductView.module.css";

export default function ProductView({ product }: { product: Product }) {
	const owner = useAPI<User>("/user/" + product.owner) ?? null;
	const prodImages = useAPI<ProductImage[]>("/product-image/from/" + product.id);
	product.imageUrls = [];

	if (owner === null) return <Throbber/>;
	if (owner === undefined) return <NotFound/>;

	if (prodImages === null) return <Throbber/>;
	if (prodImages === undefined) return <NotFound/>;

	prodImages.map(prodImage => product.imageUrls.push(prodImage.url));

	return (
		<div className={styles['product-view']}>
			<div>
				<Typography>{product.name}</Typography>
				<Typography className={styles.seller}>
					Seller: {owner ? owner.displayName : "Seller not found"}
				</Typography>
			</div>

			<hr className={styles['horizontal-rule']}/>

			<div>
				<p>{product.description}</p>
			</div>

			<hr className={styles['horizontal-rule']}/>

			<div>
				<img
					className={styles['thumbnail-image']}
					src={product.thumbnailImageUrl}
					alt={product.name}
				/>
			</div>

			<div className={styles['extra-image-container']}>
				{product.imageUrls.map((url, index) => (
					<div key={url} style={{ cursor: "pointer" }}>
						<img
							className={styles['extra-image']}
							src={url}
							alt={`Product Image ${index + 1}`}
							onClick={() => window.open(url, "_blank")}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
