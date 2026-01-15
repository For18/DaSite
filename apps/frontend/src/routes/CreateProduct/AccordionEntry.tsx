import Button from "@component/Button";
import Image from "@component/Image";
import type { Dispatch, SetStateAction } from "react";
import styles from "./CreateProduct.module.scss";

export default function AccordionEntry(
	{ index, imageUrl, name, setImages }: { index: number, imageUrl: string, name: string,
		setImages: Dispatch<SetStateAction<string[]>> }
) {
	return (
		<div className={styles.card}>
			<Image
				className={styles.accordionImage}
				src={imageUrl}
				alt={name}
			/>
			<Button
				className={styles.accordionButton}
				onClick={() => setImages(entries => entries.filter((_, i) => i != index))}
			>
				Remove
			</Button>
		</div>
	);
}
