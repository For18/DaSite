import { useParams } from "react-router";
import Throbber from "../components/Throbber";
import { Product, useAPI } from "../lib/api";
import NotFound from "./NotFound";
import Typography from "../components/Typography";
import Image from "../components/Image";
import Section from "../components/Section";

type OtherUser = {
	id: number;
	name: string;
	subtitle: string;
	avatarColor: string;
	avatarUrl?: string;
	auctions?: string;
};

const otherUsers: OtherUser[] = [
	{ id: 1, name: "Lisa", subtitle: "Loves auctions and her cats, has a grey shorthair and a ginger tabby",
		avatarColor: "#FF5733",
		avatarUrl: "https://cats.com/wp-content/uploads/2025/10/GoodVets-Cat-At-Vet-24-540x360.jpg" },
	{ id: 2, name: "Hendriks", subtitle: "Collector of rare items", avatarColor: "#33FF57",
		avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/4/46/WilliamOfOrange1580.jpg" },
	{ id: 3, name: "Joost", subtitle: "Bidding enthusiast", avatarColor: "#5733ff",
		avatarUrl:
			"https://media.istockphoto.com/id/504709773/photo/suiting-up-for-success.jpg?s=612x612&w=0&k=20&c=8-iwsA0ZhyZRtA0jDyKqdiyA-gGYyB1GHxrNLYKJ7L8=" },
	{ id: 4, name: "Microsoft", subtitle: "Just here for the deals", avatarColor: "#ff33a8",
		avatarUrl:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" }
];

export default function Profile() {
	const { userId: userIdString } = useParams();
	if (!userIdString) return <NotFound/>;
	const userId = parseInt(userIdString);

	const user = otherUsers.find(u => u.id === userId);
	if (!user) return <NotFound/>;

	const userProducts = useAPI<Product[]>("/products?owner=" + userIdString);

	return (
		<>
			<Section>
				<div style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center"
				}}>
					<Image src={user.avatarUrl} alt={`${user.name}'s avatar`}/>
					<Typography heading={1}>
						{user.name}
					</Typography>
				</div>

				<Typography color="secondary">
					{user.subtitle}
				</Typography>
			</Section>
			<Section flex={{
				direction: "row",
				align: "center",
				gap: 2
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
