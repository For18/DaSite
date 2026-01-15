import useAuth from "@/AuthProvider";
import NotFound from "@route/NotFound";
import BeforeAuction from "@component/BeforeAuction";
import Button from "@component/Button";
import Clock from "@component/Clock";
import EndedAuction from "@component/EndedAuction";
import Input from "@component/Input";
import ProductView from "@component/ProductView";
import SaleHistoryPopUp from "@component/SaleHistoryPopUp";
import Throbber from "@component/Throbber";
import { API_URL, type Auction, type AuctionItem, useAPI, type User } from "@lib/api";
import useTime from "@lib/hooks/useTime";
import { Routes } from "@route/Routes";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import styles from "./Clock.module.scss";

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

const BUFFER_LEN = 5000;

async function postSale(purchaser: User["id"], auctionId: number, amount: number, price: number) {
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

	useEffect(() => {
		if (!auctionId) return;
		fetch(API_URL + Routes.AuctionItem.GetByAuction(auctionId))
			.then(response => response.json())
			.then(data => data as AuctionItem[])
			.then(items => {
				setItems(items);
			});
	}, [auctionId]);

	const currentTime = useTime();

	const [currentItemStartTime, setCurrentItemStartTime] = useState<number | null>(null);

	useEffect(() => {
		setCurrentItemStartTime(auction?.startingTime);
	}, [auction]);

	const auctionedItemLenMillis = currentItem && currentItem.length ?
		currentItem.length * 1000 :
		null;
	const elapsedTime = currentItemStartTime != null ? currentTime - currentItemStartTime : 0;
	const progress = auctionedItemLenMillis ? elapsedTime / auctionedItemLenMillis : 0;

	const isAuctionOver = items?.length === 0 && items[0] == null;

	const doShift = () => {
		if (!items || items.length < 0) return;
		items.shift();
		setCurrentItemStartTime(Date.now() + BUFFER_LEN);
	};

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
		postSale(user.id!, Number(auctionId)!, count, Number(currentPrice));
	};

	if (items === null) return <Throbber/>;
	if (items === undefined) return <NotFound/>;

	if (isAuctionOver) return <EndedAuction currentAuctionId={auctionId}/>;
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
					<EndedAuction currentAuctionId={auction.id}/> :
					isBuffered ?
					(
						<>
							<BeforeAuction remainingTimeMs={currentItemStartTime - currentTime}/>
							{import.meta.env.DEV ? <Button onClick={() => setCurrentItemStartTime(Date.now())}>Skip</Button> : null}
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
