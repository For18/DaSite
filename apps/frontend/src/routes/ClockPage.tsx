import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import BeforeAuction from "../components/BeforeAuction";
import Clock from "../components/Clock";
import EndedAuction from "../components/EndedAuction";
import ProductView from "../components/ProductView";
import Throbber from "../components/Throbber";
import { API_URL, type Auction, type Product, useAPI } from "../lib/api";
import { useTime } from "../lib/util";
import styles from "./ClockPage.module.scss";
import NotFound from "./NotFound";

function formatStartCountDown(startingTime: number, currentTime: number) {
	if (startingTime <= 0 || currentTime <= 0) return "0.00";
	const remainingTime = startingTime - currentTime;
	return (remainingTime / 1000).toFixed(2);
}

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

export default function ClockPage() {
  /* Main state holders */
  const bufferLen = 5000;
	const { auctionId } = useParams();
	const auction = useAPI<Auction>("/auction/" + auctionId);
	const product = useAPI<Product>(auction ? "/product/" + auction.productId : null);

	const mountTimeRef = useRef<number>(Date.now());
	const [wasAuctionEndedByUser, setWasAuctionEndedByUser] = useState<boolean>(false);

	/* TODO: remove useEffect() after testing */
	useEffect(() => {
		if (!auction) return;
		fetch(API_URL + "/auction/" + auction?.id, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify([{ op: "replace", path: "/startingTime", value: Math.round(Date.now() + bufferLen) }])
		}).then(() => console.log("patched"));
	}, [auction]);

  useEffect(() => {
      if (progress >= 1){
        setCurrentItemIndex(i => i + 1);
      }
  }, [progress]);

  /* TODO: set buffer between auctions swaps so ppl actually have time to see the product */
  const onPurchase = (count: number)  => {
    currentItemCountRef.current -= count;
    if (currentItemCountRef.current <= 0) setCurrentItemIndex(i => i + 1);
  }

  if (auctionItems === null) return <Throbber/>;
  if (auctionItems === undefined) return <NotFound/>;

  if (isAuctionOver) return <EndedAuction id={Number(auctionId) ?? 0}/>;
  if (currentItem === null) return <NotFound/>;

	const wasOverOnLoad = useMemo(() => {
		if (!auction || auction.startingTime == null) return false;
		const auctionEndMillis = auction.startingTime + auction.length * 1000;
		return mountTimeRef.current > auctionEndMillis;
	}, [auction]);

	if (auction === undefined) return <NotFound/>;
	if (auction === null) return <Throbber/>;
	if (wasOverOnLoad) return <EndedAuction id={auction.id}/>;

	const auctionLenMillis = auction.length * 1000;
	const elapsedTime = startingTime != null ? currentTime - startingTime : 0;
	const auctionProgress = elapsedTime / auctionLenMillis;
	const isAuctionOver = wasAuctionEndedByUser || auctionProgress >= 1;

	const currentPrice = Math.min(
		Math.max(lerp(auction.startingPrice, auction.minimumPrice, auctionProgress), auction.minimumPrice),
		auction.startingPrice
	).toFixed(2);

	const remainingTime = auctionedItemLenMillis ? auctionedItemLenMillis - elapsedTime : 0;
	const fmtedRemainingTime = auctionedItemLenMillis ? (remainingTime > auctionedItemLenMillis ?
		formatDuration(0) :
		formatDuration(remainingTime);

	return (
		<div className={styles.baseContainer}>
			<div className={styles.clockContainer}>
				{auctionProgress <= 0 ?
					<BeforeAuction startingPoint={formatStartCountDown(startingTime ?? 0, currentTime)}/> :
					(isAuctionOver ?
						<EndedAuction id={auction.id}/> :
						(
							<Clock progress={auctionProgress} price={currentPrice} fmtedTime={fmtedRemainingTime}
								count={auction.count} setWasAuctionEndedByUser={setWasAuctionEndedByUser}/>
						))}
			</div>

			<div className={styles.containerSeparator}/>

			<div className={styles.productContainer}>
				{product == null ? <Throbber/> : <ProductView product={product} batchSize={auction.batchSize}/>}
			</div>
		</div>
	);
}

