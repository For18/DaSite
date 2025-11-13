import { useParams } from "react-router";
import Image from "../components/Image";
import Section from "../components/Section";
import Throbber from "../components/Throbber";
import Typography from "../components/Typography";
import { Product, useAPI, User } from "../lib/api";
import NotFound from "./NotFound";
import styles from "./Profile.module.scss";

export default function Profile() {
	const { userId: userIdString } = useParams();
	if (!userIdString) return <NotFound/>;
	const userId = parseInt(userIdString);

	const user = useAPI<User>("/private-user/" + userId);
	const userProducts = useAPI<Product[]>("/products/user/" + userId);

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
									src={user.imageUrl}
									alt={`${user.displayName}'s avatar`}
								/>
							</div>

							<Typography heading={1}>
								{user.displayName}
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
