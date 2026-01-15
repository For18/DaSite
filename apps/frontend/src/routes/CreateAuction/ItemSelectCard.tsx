import Typography from "@component/Typography";
import Checkbox from "@component/Checkbox";
import { API_URL, type AuctionItem, type Product, type ProductImage } from "@lib/api";
import usePromise from "@lib/hooks/usePromise";
import { Routes } from "@route/Routes";
import Image from "@component/Image";
import styles from "./CreateAuction.module.scss";

interface ItemSelectCardProps {
	item: AuctionItem;
	selected: boolean;
	onToggle: () => void;
}

export default function ItemSelectCard({ item, selected, onToggle }: ItemSelectCardProps) {
	const { value: product, isLoading: isProductLoading } = usePromise<Product>(
		() => fetch(API_URL + Routes.Product.Get(item.productId)).then(response => response.json()),
		[item.productId]
	);
	const { value: thumbnailProductImage } = usePromise<ProductImage>(
		() =>
			isProductLoading ?
				null :
				product.thumbnailImageId === null ?
				undefined :
				fetch(Routes.ProductImage.Get(product.thumbnailImageId)).then(response => response.json()),
		[isProductLoading, product?.thumbnailImageId]
	);
	if (product == null) return null;

	return (
		<div className={styles.productContainer}>
			<Checkbox checked={selected} onClick={onToggle}/>
			<div className={styles.product + (selected ? ` ${styles.selected}` : "")} onClick={onToggle}>
				{isProductLoading || product.thumbnailImageId == null ?
					null :
					(
						<Image className={styles.productImage} src={thumbnailProductImage.url}
							alt={`${product.name}'s thumbnail`}/>
					)} {/* TODO: Test */}
				<div>
					{/* TODO: Improve */}
					<Typography>{product.name}</Typography>
					<Typography>x{item.batchSize * item.count}</Typography>
				</div>
			</div>
		</div>
	);
}