import Throbber from "@component/Throbber";
import { useAPI, type Product, type ProductImage } from "@lib/api";
import NotFound from "@route/NotFound";
import Typography from "@component/Typography";
import styles from "./Profile.module.scss"
import { Routes } from "@route/Routes";
import Image from "@component/Image";

export default function ProductInfo({ product }: { product: Product }) {
	const images = useAPI<ProductImage[]>(product ? Routes.ProductImage.FromParent(product.id) : null);
	if (images === null) return <Throbber/>;
	if (images === undefined) return <NotFound/>;

	return (
		<div className={styles.modalBody}>
			<Typography>{product.name}</Typography>
			<Typography>{product.description}</Typography>
			<div className={styles.separator}/>
			<div className={styles.imageContainer}>
				{images &&
					images.map((image, index) => (
						<Image src={image.url} alt={product.name + index} width={100} height={100}/>
					))}
			</div>
		</div>
	);
}