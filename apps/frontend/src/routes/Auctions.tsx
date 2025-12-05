import { useEffect, useMemo } from "react";
import ProductView from "../components/ProductView";
import Section from "../components/Section";
import Throbber from "../components/Throbber";
import Typography from "../components/Typography";
import { API_URL, Auction, AuctionEntry, AuctionItem, Product, useAPI } from "../lib/api";
import { formatEuros, usePromise } from "../lib/util";

/* TODO: update
 * each card should hold title of auction and have a list of links or hover-able text or similar
 * which displays the info abt the products listed
 */
export default function Auctions() {
	useEffect(() => {
		document.title = "For18 - auctions";
	});

	const auctions = useAPI<Auction[]>("/auctions");

	const { value: auctionEntries, isLoading: auctionEntriesLoading } = usePromise<AuctionEntry[]>(() =>
		Promise.all(
			auctions?.map(auction =>
				fetch(API_URL + "/auction-entry/from-auction/" + auction.id)
					.then(response => response.json())
			) ?? []
		).then(entryArrays => entryArrays.flat()), [auctions]);

	const auctionItemIds = useMemo(() => {
		const ids = new Set();
		auctionEntries?.forEach(entry => ids.add(entry.itemId));
		return Array.from(ids);
	}, [auctionEntries]);

	const { value: auctionItems } = usePromise<AuctionItem[]>(
		() =>
			Promise.all(auctionItemIds.map(auctionItemId =>
				fetch(API_URL + "/auction-item/" + auctionItemId)
					.then(response => response.json())
			)),
		[auctionItemIds]
	);

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
					auctions.map(auction => (
						<Section key={auction.id}>
							{auctionEntriesLoading ? <Throbber/> : auctionEntries
								?.filter(entry => entry.auctionId === auction.id)
								.map(entry => auctionItems?.find(item => item.id === entry.itemId))
								.filter(item => item !== undefined)
								.map(item => (
									<Section key={item.id}>
										<ProductView auctionItem={item}/>
										<Typography color="secondary">
											Price: {formatEuros(item.startingPrice)} → {formatEuros(item.minimumPrice)}
											{" "}
											• Count: {item.count}
										</Typography>
									</Section>
								))}
						</Section>
					))}
			</Section>
		</>
	);
}
