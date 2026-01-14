import Accordion from "@/components/Accordion";
import Button from "@/components/Button/Button";
import usePromise from "@/lib/hooks/usePromise";
import useTime from "@/lib/hooks/useTime";
import ProductView from "@component/ProductView";
import Section from "@component/Section";
import Throbber from "@component/Throbber";
import Typography from "@component/Typography";
import { API_URL, type Auction, type AuctionEntry, type AuctionItem, type Product, useAPI } from "@lib/api";
import { formatEuros } from "@lib/util";
import { Routes } from "@route/Routes";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router";

const timeLeft = (ms: number) => {
	if (ms <= 0) return "Now";

	const totalSeconds = Math.floor(ms / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
};

export default function Auctions() {
	useEffect(() => {
		document.title = "For18 - auctions";
	});

	const navigate = useNavigate();

	const [openItem, setOpenItem] = useState<string | null>(null);

	const now = useTime();

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

	const productIds = useMemo(() => {
		const ids = new Set<number>();
		auctionItems?.forEach(item => ids.add(item.productId));
		return Array.from(ids);
	}, [auctionItems]);

	//TODO: Use/fix Routes.Product.BatchGet
	const { value: products } = usePromise<Product[]>(
		() =>
			Promise.all(
				productIds.map(productId =>
					fetch(API_URL + Routes.Product.Get(productId))
						.then(response => response.json())
				)
			),
		[productIds]
	);

	const productMap = useMemo(() => {
		const map = new Map<number, Product>();
		products?.forEach(product => map.set(product.id, product));
		return map;
	}, [products]);

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
							// TODO: make a component for this
							const itemsForAuction = auctionEntries?.filter(entry => entry.auctionId === auction.id)
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

									<Button variant="outlined" onClick={() => navigate(Routes.Pages.Clock(auction.id))}>
										Go to auction
									</Button>

									{auctionEntriesLoading ?
										<Throbber/> :
										(
											<>
												{itemsForAuction.map(item => {
													//TODO: make a component/funcionality for a group of accordions
													const accordionkey = `${auction.id}-item-${item.id}`;
													return (
														<Accordion key={item.id}
															title={productMap.get(item.productId)?.name}
															open={openItem === accordionkey} onToggle={() =>
															setOpenItem(prev =>
																prev === accordionkey ? null : accordionkey
															)}
														>
															{/* TODO: remove this when fixing layout styles */}
															<div style={{ padding: "1rem" }}>
																<ProductView auctionItem={item}/>
																<Typography color="secondary">
																	Price: {formatEuros(item.startingPrice)} →{" "}
																	{formatEuros(item.minimumPrice)} • Count:{" "}
																	{item.count}
																</Typography>
															</div>
														</Accordion>
													);
												})}
											</>
										)}
								</Section>
							);
						})}
			</Section>
		</>
	);
}
