import Image from "@component/Image";
import Section from "@component/Section";
import Throbber from "@component/Throbber";
import Typography from "@component/Typography";
import { type Product, type PublicUser, useAPI } from "@lib/api";
import NotFound from "@route/NotFound";
import { Routes } from "@route/Routes";
import { useParams } from "react-router";
import styles from "./Profile.module.scss";

export default function Profile() {
	const { userId } = useParams();
	if (!userId) return <NotFound/>;

	// TODO: type fix
	const user = useAPI<PublicUser>(Routes.User.GetPublic(userId));
	const userProducts = useAPI<Product[]>(Routes.Product.GetOfUser(userId));

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

						{
							/* <Typography className={styles.profileSubtitle} color="secondary">
						{user.subtitle}
					</Typography> */
						}
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
							<Typography key={product.id}>
								{product.name}
							</Typography> // TODO: images be put later when new components can be used.
						))
					)}
			</Section>
		</>
	);
}
