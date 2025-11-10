import { Avatar, Box, Card, CardContent, Paper, Typography } from "@mui/material";
import { useParams } from "react-router";
import Header from "../components/Header";
import Throbber from "../components/Throbber";
import { Product, useAPI } from "../lib/api";
import NotFound from "./NotFound";

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
			<Paper sx={{
				padding: "20px",
				width: "1000px",
				maxWidth: "80vw"
			}}>
				<div style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center"
				}}>
					<Avatar sx={{
						width: 96,
						height: 96,
						border: `1px solid ${user.avatarColor}`
					}} src={user.avatarUrl}/>
					<Typography sx={{ marginLeft: "16px" }}>
					</Typography>
					<Header level={1} color="textPrimary">
						{user.name}
					</Header>
				</div>

				<Typography color="textSecondary" sx={{
					marginTop: "8px"
				}}>
					{user.subtitle}
				</Typography>
			</Paper>
			<Paper sx={{
				padding: "10px",
				height: "100px",
				marginTop: "20px",
				alignItems: "center",
				display: "flex",
				flexDirection: "row",
				gap: 2
			}}>
				{userProducts == null ? <Throbber/> : userProducts.length == 0 ?
					(
						<Typography color="textPrimary">
							This user does not have any products
						</Typography>
					) :
					(
						userProducts.map(product => (
							<Typography color="textPrimary" key={product.id} sx={{ fontSize: "16px" }}>
								{product.name}
							</Typography> // images be put later when new components can be used.
						))
					)}
			</Paper>
		</>
	);
}
