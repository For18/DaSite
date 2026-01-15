import NotFound from "@/routes/NotFound/NotFound";
import Image from "@component/Image";
import Modal from "@component/Modal";
import Section from "@component/Section";
import Throbber from "@component/Throbber";
import Typography from "@component/Typography";
import { type Product, type PublicUser, useAPI } from "@lib/api";
import { Routes } from "@route/Routes";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProductInfo from "./ProductInfo";
import styles from "./Profile.module.scss";

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

	useEffect(() => {
		document.title = `For18 - ${user?.userName ?? "Unnamed"}'s profile`;
	}, [user]);

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
