import usePromise from "@/lib/hooks/usePromise";
import ProductView from "@component/ProductView";
import Section from "@component/Section";
import Throbber from "@component/Throbber";
import Typography from "@component/Typography";
import { API_URL, type Auction, type AuctionEntry, type AuctionItem, useAPI } from "@lib/api";
import { formatEuros } from "@lib/util";
import { Routes } from "@route/Routes";
import { useEffect, useMemo, useState } from "react";

/* TODO: update
 * each card should hold title of auction and have a list of links or hover-able text or similar
 * which displays the info abt the products listed
 */
export default function Auctions() {
	useEffect(() => {
		document.title = "For18 - auctions";
	});

	const [now, setNow] = useState(Date.now());

	useEffect(() => {
		const interval = setInterval(() => {
			setNow(Date.now());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const auctions = useAPI<Auction[]>(Routes.Auction.GetUpcoming);

	const { value: auctionEntries, isLoading: auctionEntriesLoading } = usePromise<AuctionEntry[]>(() =>
		Promise.all(
			auctions?.map(auction =>
				fetch(API_URL + Routes.AuctionEntry.GetFromAuction(auction.id))
					.then(response => response.json())
			) ?? []
		).then(entryArrays => entryArrays.flat()), [auctions]);

	const auctionItemIds = useMemo(() => {
		const ids = new Set<number>();
		auctionEntries?.forEach(entry => ids.add(entry.itemId));
		return Array.from(ids);
	}, [auctionEntries]);

	const { value: auctionItems } = usePromise<AuctionItem[]>(
		() =>
			Promise.all(
				auctionItemIds.map(auctionItemId =>
					fetch(API_URL + Routes.AuctionItem.Get(auctionItemId))
						.then(response => response.json())
				)
			),
		[auctionItemIds]
	);

	const timeLeft = (ms: number) => {
		if (ms <= 0) return "Now";

		const totalSeconds = Math.floor(ms / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${
			String(seconds).padStart(2, "0")
		}`;
	};

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
						.map(auction => {
							const itemForAuction = auctionEntries?.filter(entry => entry.auctionId === auction.id)
								.map(entry => auctionItems?.find(item => item.id === entry.itemId))
								.filter((item): item is AuctionItem => item !== undefined) ?? [];

						return (
							<Section key={auction.id}>
								<Typography heading={2}>
									Auction {auction.id}
								</Typography>

								<Typography color="secondary">
									Starts in: {timeLeft(auction.startingTime - now)}
								</Typography>

								{auctionEntriesLoading ?
									<Throbber/> :
									(
										<>
											{itemForAuction.map(item => (
												<Section key={item.id}>
													<ProductView auctionItem={item}/>
													<Typography color="secondary">
														Price: {formatEuros(item.startingPrice)} →{" "}
														{formatEuros(item.minimumPrice)} • Count: {item.count}
													</Typography>
												</Section>
											))}
										</>
									)}
							</Section>
						);
					})}
			</Section>
		</>
	);
}
