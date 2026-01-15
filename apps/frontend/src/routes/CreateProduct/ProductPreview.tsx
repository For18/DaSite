import Image from "@component/Image";
import Typography from "@component/Typography";
import styles from "./CreateProduct.module.scss";

export default function ProductPreview(
	{ name, description, showThumbnail, batchSize, images, owner }: { name: string, description: string,
		showThumbnail?: boolean, batchSize?: number, images: string[], owner?: string }
) {
	return (
		<div className={styles.productPreview}>
			<div>
				<Typography heading={1}>{name == "" ? "Product Name" : name}</Typography>
				<Typography className={styles.seller}>
					Seller: {owner ? owner : "Seller not found"}
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
				<Typography>{description == "" ? "Description" : description}</Typography>
			</div>

			{images[0] && showThumbnail ?
				(
					<>
						<hr className={styles.horizontalRule}/>
						<Image
							className={styles.thumbnailImage}
							src={images[0]}
							alt={name}
						/>
					</>
				) :
				null}

			<div className={styles.extraImageContainer}>
				{images.map((url, index) => (
					<div key={index}>
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