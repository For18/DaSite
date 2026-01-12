import useAuth from "@/AuthProvider";
import Input from "@/components/Input";
import SaleHistoryPopUp from "@/components/SaleHistoryPopUp";
import BeforeAuction from "@component/BeforeAuction";
import Button from "@component/Button";
import Clock from "@component/Clock";
import EndedAuction from "@component/EndedAuction";
import ProductView from "@component/ProductView";
import Throbber from "@component/Throbber";
import { API_URL, type Auction, type AuctionItem, useAPI, User } from "@lib/api";
import useTime from "@lib/hooks/useTime";
import NotFound from "@route/NotFound";
import { Routes } from "@route/Routes";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import styles from "./ClockPage.module.scss";

function lerp(from: number, to: number, t: number): number {
	return from + t * (to - from);
}

function formatDuration(duration: number): string {
	if (duration < 0) return "00:000";

	const milliseconds = Math.round(duration % 1000);
	const seconds = Math.floor(duration / 1000) % 60;

	return `${(seconds < 10 ? "0" : "") + seconds}:${
		(milliseconds < 100 ? "0" : "") + (milliseconds < 10 ? "0" : "") + milliseconds
	}`;
}

function formatStartCountDown(startingTime: number, currentTime: number) {
	if (startingTime <= 0 || currentTime <= 0) return "0.00";
	const remainingTime = startingTime - currentTime;
	return (remainingTime / 1000).toFixed(2);
}

const BUFFER_LEN = 5000;

async function PostSale(purchaser: User["id"], auctionId: number, amount: number, price: number) {
	await fetch(API_URL + Routes.Sale.Post, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			purchaser: purchaser,
			purchasedAuctionId: auctionId,
			amount: amount,
			price: price,
			isPaid: false
		})
	});
}

/* TODO: contemplate if timed out auctions should be added to the back of the items stack being sold */
export default function ClockPage() {
	/* Main state holders */
	const { auctionId: auctionIdString } = useParams();
	const auctionId = auctionIdString == null ? null : parseInt(auctionIdString);
	const auction = useAPI<Auction>(auctionId != null ? Routes.Auction.Get(auctionId) : null);
	const [items, setItems] = useState<AuctionItem[] | null>(null);
	const { user } = useAuth();
	const [historyOpen, setHistoryOpen] = useState<boolean>(false);
	const currentItem = items ? items[0] : null;

	const buyCountRef = useRef<number>(0);

	const doShift = () => {
		if (!items || items.length < 0) return;
		items.shift();
	};

	useEffect(() => {
		if (!auctionId) return;
		fetch(API_URL + Routes.AuctionItem.GetByAuction(auctionId))
			.then(response => response.json())
			.then(data => data as AuctionItem[])
			.then(items => {
				setItems(items);
			});
	}, [auctionId]);

	const currentItemStartTime = useMemo<number | null>(() => {
		return Date.now() + BUFFER_LEN;
	}, [currentItem, items]);

	const currentTime = useTime();

	const auctionedItemLenMillis = currentItem && currentItem.length ?
		currentItem.length * 1000 :
		null;
	const elapsedTime = currentItemStartTime != null ? currentTime - currentItemStartTime : 0;
	const progress = auctionedItemLenMillis ? elapsedTime / auctionedItemLenMillis : 0;

	const isAuctionOver = items?.length === 0 && items[0] === null;

	/* Temp moving of starting time
   * TODO: remove after testing
   */
	useEffect(() => {
		if (!auction) return;
		fetch(API_URL + Routes.Auction.Get(auction?.id), {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify([{ op: "replace", path: "/startingTime", value: Math.round(Date.now() + BUFFER_LEN) }])
		}).then(() => console.log("patched"));
	}, [auction]);

	useEffect(() => {
		if (progress >= 1) {
			doShift();
		}
	}, [progress]);

	// TODO: add visual indicator to see if purchase was successful
	const onPurchase = (count: number) => {
		currentItem?.count && (currentItem.count -= count);
		if (currentItem && currentItem.count <= 0) doShift();

		if (user === undefined) return;
		PostSale(user.id!, Number(auctionId)!, count, Number(currentPrice));
	};

	if (items === null) return <Throbber/>;
	if (items === undefined) return <NotFound/>;

	if (isAuctionOver) return <EndedAuction id={Number(auctionId) ?? 0}/>;
	if (currentItem === null) return <Throbber/>;
	if (currentItem === undefined) return <NotFound/>;

	if (auction === undefined) return <NotFound/>;
	if (auction === null) return <Throbber/>;

	/* Specifics formatting */
	const currentPrice = Math.min(
		Math.max(lerp(currentItem.startingPrice, currentItem.minimumPrice, progress), currentItem.minimumPrice),
		currentItem.startingPrice
	).toFixed(2);

	const remainingTime = auctionedItemLenMillis ? auctionedItemLenMillis - elapsedTime : 0;
	const fmtedRemainingTime = auctionedItemLenMillis ?
		(remainingTime > auctionedItemLenMillis ?
			formatDuration(0) :
			formatDuration(remainingTime)) :
		"0";

	const isBuffered = currentItemStartTime ? currentTime < currentItemStartTime : false;

	return (
		<div className={styles.baseContainer}>
			<div className={styles.clockContainer}>
				{isAuctionOver ?
					<EndedAuction id={auction.id}/> :
					isBuffered ?
					(
						<>
							<BeforeAuction startingPoint={formatStartCountDown(currentItemStartTime!, currentTime)}/>
						</>
					) :
					(
						<>
							<Clock progress={progress} price={currentPrice} fmtedTime={fmtedRemainingTime}
								count={currentItem.count ?? 0}/>
						</>
					)}
				<div className={styles.purchaseContainer}>
					<Input
						className={styles.input}
						type="number"
						onChange={countString => {
							buyCountRef.current = Number(countString);
						}}
					/>
					<Button
						variant="outlined"
						disabled={progress < 0 || progress > 1 || isBuffered}
						onClick={() => {
							onPurchase(buyCountRef.current);
							alert(`Bought ${buyCountRef.current} products for € ${currentPrice} each`);
						}}
					>
						BUY
					</Button>
					<SaleHistoryPopUp item={currentItem} open={historyOpen} onClose={() => setHistoryOpen(false)}/>
				</div>
			</div>
			<div className={styles.containerSeparator}/>

			<div className={styles.productContainer}>
				<ProductView auctionItem={currentItem}/>
				<Button className={styles.historyButton} onClick={() => setHistoryOpen(true)}>History</Button>
			</div>
		</div>
	);
}
