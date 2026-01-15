import Image from "@component/Image";
import Typography from "@component/Typography";
import type { Product, ProductImage } from "@lib/api";
import usePromise from "@lib/hooks/usePromise";
import { Routes } from "@route/Routes";
import styles from "./CreateAuctionItem.module.scss";

interface ProductSelectCardProps {
	product: Product;
	selected: boolean;
	onToggle: () => void;
}

export default function ProductSelectCard({ product, selected, onToggle }: ProductSelectCardProps) {
	const { value: thumbnailProductImage } = usePromise<ProductImage>(
		() =>
			product.thumbnailImageId === null ?
				undefined :
				fetch(Routes.ProductImage.Get(product.thumbnailImageId)).then(response => response.json()),
		[product?.thumbnailImageId]
	);

	return (
		<div
			className={styles.product + (selected ? ` ${styles.selected}` : "")}
			onClick={onToggle}
			role="button"
			tabIndex={0}
		>
			{product.thumbnailImageId != null && thumbnailProductImage?.url && (
				<Image
					className={styles.productImage}
					src={thumbnailProductImage.url}
					alt={`${product.name}'s thumbnail`}
				/>
			)}
			<div>
				<Typography>{product.name}</Typography>
			</div>
		</div>
	);
}
