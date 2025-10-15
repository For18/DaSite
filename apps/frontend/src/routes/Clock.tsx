import { alpha } from "@mui/material/styles";
import ProductView from "../components/ProductView";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { API_URL, Auction } from "../lib/api";
import Throbber from "../components/Throbber";

export default function Clock() {
	const { auctionId } = useParams();
	const [auction, setAuction] = useState<Auction | null>(null);

	useEffect(() => {
		fetch(API_URL + "/auction/" + auctionId).then(response => response.json()).then(setAuction)
	}, [auctionId])

	return (
		<div
			style={{
				width: "100vw",
				height: "100%",
				display: "flex",
				flexDirection: "row",
			}}
		>
			<div
				style={{
					width: "50%",
					height: "100%",
					borderRight: "1px solid",
					borderColor: alpha("#888888", 0.1),
				}}
			></div>
			<div
				style={{
					width: "50%",
					height: "100%",
					borderLeft: "1px solid",
					borderColor: alpha("#888888", 0.1),
				}}
			>
				{auction == null ? <Throbber/> : <ProductView productId={auction.product}/>}
			</div>
		</div>
	);
}
