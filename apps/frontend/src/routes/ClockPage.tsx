import { useMemo, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import EndedAuction from "../components/EndedAuction";
import ProductView from "../components/ProductView";
import Throbber from "../components/Throbber";
import { API_URL, AuctionItem, Auction, useAPI } from "../lib/api";
import styles from "./ClockPage.module.scss";
import NotFound from "./NotFound";
import { useTime } from "../lib/util";
import Button from "../components/Button";
import Clock from "../components/Clock";
import BeforeAuction from "../components/BeforeAuction"

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

/* TODO: contemplate if timed out auctions should be added to the back of the auctionItems stack being sold */
export default function ClockPage() {
  /* Main state holders */
  const bufferLen = 5000;
	const { auctionId } = useParams();
  const auctionItems = useAPI<AuctionItem[]>("/auction-item/get-by-auction/" + auctionId);
  const auction = useAPI<Auction>("/auction/" + auctionId);

  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const [isAuctionOver, setIsAuctionOver] = useState<boolean>(false);
  const currentItemCountRef = useRef<number>(0);
  const buyCountRef = useRef<number>(0);

  const currentItem = useMemo<AuctionItem | null>(() => {
      if (!auctionItems) return null;
      if (auctionItems.length === 0 || currentItemIndex >= auctionItems.length) {
        setIsAuctionOver(true);
        return null;
      }

      currentItemCountRef.current = auctionItems[currentItemIndex].count;
      return auctionItems[currentItemIndex];
   }, [currentItemIndex, auctionItems])

  const currentItemStartTime = useMemo<number | null>(() => {
      return Date.now() + bufferLen;
  }, [currentItemIndex, auctionItems]);

  const currentTime = useTime();

  const auctionedItemLenMillis = auctionItems && auctionItems[currentItemIndex] ? auctionItems[currentItemIndex].length * 1000 : null;
  const elapsedTime = currentItemStartTime != null ? currentTime - currentItemStartTime: 0;
  const progress = auctionedItemLenMillis ? elapsedTime / auctionedItemLenMillis : 0;
  
  /* Temp moving of starting time 
   * TODO: remove after testing
   */
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

	if (auction === undefined) return <NotFound/>;
	if (auction === null) return <Throbber/>;

  /* Specifics formatting */
	const currentPrice = Math.min(
		Math.max(lerp(currentItem.startingPrice, currentItem.minimumPrice, progress), currentItem.minimumPrice),
		currentItem.startingPrice
	).toFixed(2);

	const remainingTime = auctionedItemLenMillis ? auctionedItemLenMillis - elapsedTime : 0;
	const fmtedRemainingTime = auctionedItemLenMillis ? (remainingTime > auctionedItemLenMillis ?
		formatDuration(0) :
		formatDuration(remainingTime)) : '0';

  const isBuffered = currentItemStartTime ? currentTime < currentItemStartTime : false;

  return (
		<div className={styles.baseContainer}>
			<div className={styles.clockContainer}> 
        { isBuffered ? <> <BeforeAuction startingPoint={formatStartCountDown(currentItemStartTime!, currentTime)}/> </> :
          <>
            <Clock progress={progress} price={currentPrice} fmtedTime={fmtedRemainingTime} count={currentItemCountRef.current ?? 0}/>
          </>
        }
         <input
           className={styles.input}
           type="number"
           onChange={count => {
             buyCountRef.current = Number(count.target.value)
           }}
         />

			   <Button
			   	variant="outlined"
			   	disabled={progress < 0 || progress > 1 || isBuffered}
			   	onClick={() => {
             onPurchase(buyCountRef.current)
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

