import Section from "@component/Section";
import Throbber from "@component/Throbber";
import Typography from "@component/Typography";
import { type Auction, useAPI } from "@lib/api";
import { Routes } from "@route/Routes";
import { useEffect } from "react";
import AuctionDisplay from "./AuctionDisplay";

export default function Auctions() {
	useEffect(() => {
		document.title = "For18 - Upcoming auctions";
	});

	const auctions = useAPI<Auction[]>(Routes.Auction.GetUpcoming);

	return (
		<>
			<Typography heading={1}>Upcoming auctions</Typography>

			<Section flex={{
				direction: "column"
			}}>
				{auctions === null ?
					<Throbber/> :
					auctions === undefined || auctions.length === 0 ?
					<Typography>No active auctions</Typography> :
					auctions.sort((a, b) => a.startingTime - b.startingTime)
						.map(auction => <AuctionDisplay key={auction.id} auction={auction}/>)}
			</Section>
		</>
	);
}
