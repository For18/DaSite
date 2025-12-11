import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import BeforeAuction from "../components/BeforeAuction";
import Button from "../components/Button";
import Clock from "../components/Clock";
import EndedAuction from "../components/EndedAuction";
import ProductView from "../components/ProductView";
import Throbber from "../components/Throbber";
import { API_URL, Auction, AuctionItem, useAPI } from "../lib/api";
import { useTime } from "../lib/util";
import styles from "./ClockPage.module.scss";
import NotFound from "./NotFound";

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

/* TODO: contemplate if timed out auctions should be added to the back of the items stack being sold */
export default function ClockPage() {
	/* Main state holders */
	const { auctionId } = useParams();
	const auction = useAPI<Auction>("/auction/" + auctionId);
	const [items, setItems] = useState<AuctionItem[] | null>(null);

	const currentItem = items ? items[0] : null;

	const buyCountRef = useRef<number>(0);

	const doShift = () => {
		if (!items || items.length < 0) return;
		items.shift();
	};

	useEffect(() => {
		if (!auctionId) return;
		fetch(API_URL + "/auction-item/get-by-auction/" + auctionId)
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
		fetch(API_URL + "/auction/" + auction?.id, {
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

	/* TODO: add entry to 'sale' db table if onPurchase is called */
	const onPurchase = (count: number) => {
		currentItem?.count && (currentItem.count -= count);
		if (currentItem && currentItem.count <= 0) doShift();
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
				{isBuffered ?
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
				<input
					className={styles.input}
					type="number"
					onChange={count => {
						buyCountRef.current = Number(count.target.value);
					}}
				/>

				<Button
					className={styles.button}
					variant="outlined"
					disabled={progress < 0 || progress > 1 || isBuffered}
					onClick={() => {
						onPurchase(buyCountRef.current);
						alert(`Bought ${buyCountRef.current} products for € ${currentPrice} each`);
					}}
				>
					BUY
				</Button>
			</div>
			<div className={styles.containerSeparator}/>

			<div className={styles.productContainer}>
				<ProductView auctionItem={currentItem}/>
			</div>
		</div>
	);
}
