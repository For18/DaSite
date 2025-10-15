import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProductView from "../components/ProductView";
import Throbber from "../components/Throbber";
import { API_URL, Auction } from "../lib/api";

export default function Clock() {
	const { auctionId } = useParams();
	const [auction, setAuction] = useState<Auction | null>(null);

	useEffect(() => {
		fetch(API_URL + "/auction/" + auctionId).then(response => response.json()).then(setAuction);
	}, [auctionId]);

	return (
		<div
			style={{
				width: "100%",
				display: "grid",
				gridTemplateColumns: "auto auto"
			}}
		>
			<div></div>
			<div>
				{auction == null ? <Throbber/> : <ProductView productId={auction.product}/>}
			</div>
		</div>
	);
}
