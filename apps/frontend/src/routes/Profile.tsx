import Modal from "@component/Modal";
import Image from "@component/Image";
import Section from "@component/Section";
import Throbber from "@component/Throbber";
import Typography from "@component/Typography";
import { type Product, type ProductImage, type PublicUser, useAPI } from "@lib/api";
import NotFound from "@route/NotFound";
import { Routes } from "@route/Routes";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import styles from "./Profile.module.scss";

function ProductInfo({ product }: { product: Product }) {
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

export default function Profile() {
	const { userId } = useParams();
	if (!userId) return <NotFound/>;

	// TODO: type fix
	const user = useAPI<PublicUser>(Routes.User.GetPublic(userId));
	const userProducts = useAPI<Product[]>(Routes.Product.GetOfUser(userId));
	const [modalState, setModalState] = useState<{ open: boolean, product: Product | null }>({ open: false,
		product: null });

	useEffect(() => {
		if (modalState.open && !modalState.product) {
			setModalState({ open: false, product: null });
		}
	}, [modalState.open, modalState.product]);

	if (user === undefined) return <NotFound/>;

	return (
		<>
			<Section className={styles.profileHeader}>
				{user === null ? <Throbber/> : (
					<>
						<div className={styles.profileInfo}>
							<div className={styles.profileImage}>
								<Image
									height={96}
									src={user.avatarImageUrl}
									alt={`${user.userName ?? `User ${user.id}`}'s avatar`}
								/>
							</div>

							<Typography heading={1}>
								{user.userName ?? "Unnamed user"}
							</Typography>
						</div>
					</>
				)}
			</Section>
			<Section className={styles.profileProducts} flex={{
				direction: "row",
				align: "center",
				wrap: "wrap"
			}}>
				{userProducts == null ? <Throbber/> : userProducts.length == 0 ?
					(
						<Typography>
							This user does not have any products
						</Typography>
					) :
					(
						userProducts.map(product => (
							<Typography className={styles.productName} key={product.id} onClick={() => {
								setModalState({ open: true, product: product });
							}}>
								{product.name}
							</Typography>
						))
					)}
			</Section>

			<Modal open={modalState.open} onClose={() => setModalState({ open: false, product: null })}>
				{modalState.product && <ProductInfo product={modalState.product}/>}
			</Modal>
		</>
	);
}
