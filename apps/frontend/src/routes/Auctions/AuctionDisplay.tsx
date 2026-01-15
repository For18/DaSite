import Accordion from "@component/Accordion";
import Button from "@component/Button";
import ProductView from "@component/ProductView";
import Section from "@component/Section";
import Throbber from "@component/Throbber";
import Typography from "@component/Typography";
import { API_URL, type Auction, type AuctionEntry, type AuctionItem, type Product, useAPI } from "@lib/api";
import useGoto from "@lib/hooks/useGoto";
import usePromise from "@lib/hooks/usePromise";
import useTime from "@lib/hooks/useTime";
import { deduplicate, formatEuros } from "@lib/util";
import { Routes } from "@route/Routes";
import { useMemo, useState } from "react";

function timeLeft(ms: number) {
	if (ms <= 0) return "Now";

	const totalSeconds = Math.floor(ms / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (days >= 1) return `${days} days`;
	if (hours >= 1) return `${hours}h`;

	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

interface AuctionDisplayProps {
	auction: Auction;
}

export default function AuctionDisplay({ auction }: AuctionDisplayProps) {
	const goto = useGoto();
	const now = useTime();

	const auctionEntries = useAPI<AuctionEntry[]>(Routes.AuctionEntry.GetFromAuction(auction.id));

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

	const productIds = useMemo(() => deduplicate(auctionItems?.map(i => i.productId) ?? []), [auctionItems]);

	const products = useAPI<Product[]>(
		productIds == null || productIds.length == 0 ? null : Routes.Product.BatchGet(productIds)
	);

	const productMap = useMemo(() => {
		const map = new Map<number, Product>();
		if (products != null) products.forEach(product => map.set(product.id, product));
		return map;
	}, [products]);

	const [openItem, setOpenItem] = useState<number | null>(null);

	const itemsForAuction = auctionEntries?.filter(entry => entry.auctionId === auction.id)
		.map(entry => auctionItems?.find(item => item.id === entry.itemId))
		.filter((item): item is AuctionItem => item !== undefined) ?? [];

	const auctionStartDate = new Date(auction.startingTime);

	return (
		<Section key={auction.id}>
			<Typography heading={2}>
				Auction {auction.id}
			</Typography>

			<Typography color="secondary">
				Starts in: {timeLeft(auction.startingTime - now)} ({auctionStartDate.toLocaleDateString()} {auctionStartDate.toLocaleTimeString()})
			</Typography>

			<Button variant="outlined" onClick={() => goto(Routes.Pages.Clock(auction.id))}>
				Go to auction
			</Button>

			{auctionEntries == null ?
				<Throbber/> :
				(
					<>
						{/* TODO: make a component/funcionality for a group of accordions? */}
						{itemsForAuction.map(item => (
							<Accordion key={item.id} title={productMap.get(item.productId)?.name}
								open={openItem === item.id}
								onToggle={() => setOpenItem(prev => prev === item.id ? null : item.id)}
							>
								{/* TODO: remove this when fixing layout styles */}
								<div style={{ padding: "1rem" }}>
									<ProductView auctionItem={item}/>
									<Typography color="secondary">
										Price: {formatEuros(item.startingPrice)} → {formatEuros(item.minimumPrice)}{" "}
										• Count: {item.count}
									</Typography>
								</div>
							</Accordion>
						))}
					</>
				)}
		</Section>
	);
}
