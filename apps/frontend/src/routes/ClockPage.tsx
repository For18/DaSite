import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { SetState } from "../lib/util"; 
import { useParams } from "react-router";
import Clock from "../components/Clock";
import EndedAuction from "../components/EndedAuction";
import ProductView from "../components/ProductView";
import Throbber from "../components/Throbber";
import { API_URL, Auction, AuctionItem, useAPI } from "../lib/api";
import { useTime } from "../lib/util";
import styles from "./ClockPage.module.scss";
import NotFound from "./NotFound";
import Button from "../components/Button";

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

interface AuctionStatus {
  purchase: boolean;
  timeOut: boolean;
  count: number;
}

export default function ClockPage() {
	const { auctionId } = useParams();
  const auctionItems = useAPI<AuctionItem[]>("/auction-item/get-by-auction/" + auctionId);

  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const currentItemCountRef = useRef<number>(0);
  const [auctionStatus, setAuctionStatus]  = useState<AuctionStatus>({purchase: false, count: 0, timeOut: false});
  const [isAuctionOver, setIsAuctionOver] = useState<boolean>(false);

  const currentItem = useMemo<AuctionItem | null>(() => {
      if (!auctionItems) return null;

      if (auctionItems.length === 0 || currentItemIndex >= auctionItems.length) {
        setIsAuctionOver(true);
        return null;
      }

      currentItemCountRef.current = auctionItems[currentItemIndex].count;
      return auctionItems[currentItemIndex];
  }, [currentItemIndex, auctionItems])

  // TODO: set buffer between auctions swaps so ppl actually have time to see the product
  useEffect(() => {
      if (!currentItemCountRef) return;
      currentItemCountRef.current = currentItemCountRef.current - auctionStatus.count;

      if (currentItemCountRef.current <= 0) setCurrentItemIndex(currentItemIndex + 1);
  }, [auctionStatus.purchase]);

  useEffect(() => {
      auctionStatus.timeOut = false;
      setCurrentItemIndex(currentItemIndex + 1);
  }, [auctionStatus.timeOut]);

  if (auctionItems === null) return <Throbber/>;
  if (auctionItems === undefined) return <NotFound/>;

  if (isAuctionOver) return <EndedAuction id={Number(auctionId) ?? 0}/>;
  if (currentItem === null) return <NotFound/>;

  return (
		<div className={styles.baseContainer}>
			<div className={styles.clockContainer}>
        {/* Google told me to add the bang(!) behind `currentItem` in `ClockSection` args
          * bc it kept thinking currentItem could be null even with null check
          * Idk why that operator fixes it but assert operator cool cuzz no error
          */}
        <ClockSection auctionId={Number(auctionId)} auctionItem={currentItem!} remainingItemCount={currentItemCountRef} setAuctionStatus={setAuctionStatus}/>
			</div>

			<div className={styles.containerSeparator}/>

			<div className={styles.productContainer}>
				<ProductView auctionItem={currentItem}/>
			</div>
		</div>
  );
}

function ClockSection({ auctionId, auctionItem, remainingItemCount, setAuctionStatus} : { auctionId : number, auctionItem : AuctionItem, remainingItemCount: RefObject<number>, setAuctionStatus: SetState<AuctionStatus>  }) {
  const auction = useAPI<Auction>("/auction/" + auctionId);

  const buyCountRef = useRef<number>(0);

	/* TODO: remove useEffect() after testing */
	useEffect(() => {
		if (!auction) return;
		fetch(API_URL + "/auction/" + auction?.id, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify([{ op: "replace", path: "/startingTime", value: Math.round(Date.now() + 5000) }])
		}).then(() => console.log("patched"));
	}, [auction]);

	const startingTime = auction?.startingTime ?? 0;
	const currentTime = useTime();

	if (auction === undefined) return <NotFound/>;
	if (auction === null) return <Throbber/>;

	const auctionLenMillis = auctionItem.length * 1000;
	const elapsedTime = startingTime != null ? currentTime - startingTime : 0;
	const progress = elapsedTime / auctionLenMillis;

	const currentPrice = Math.min(
		Math.max(lerp(auctionItem.startingPrice, auctionItem.minimumPrice, progress), auctionItem.minimumPrice),
		auctionItem.startingPrice
	).toFixed(2);

	const remainingTime = auctionLenMillis - elapsedTime;
	const fmtedRemainingTime = remainingTime > auctionLenMillis ?
		formatDuration(0) :
		formatDuration(remainingTime);


  setAuctionStatus(prev => {return {purchase: prev.purchase, count: prev.count,
      timeOut: progress >= 1
  }});

  return (
      <>
        <Clock progress={progress} price={currentPrice} fmtedTime={fmtedRemainingTime} count={remainingItemCount.current ?? 0}/>

			  {/* TODO: make seperate pop up?? */}
        <input
          type="number"
          onChange={count => {
            buyCountRef.current = Number(count.target.value)
          }}
        />
			  <Button
			  	variant="outlined"
			  	disabled={progress < 0 || progress > 1}
			  	onClick={() => {
            setAuctionStatus(prev => {return {
                purchase: prev.purchase,
                count: buyCountRef.current <= remainingItemCount.current ? buyCountRef.current : remainingItemCount.current,
                timeOut: prev.timeOut
            }})
			  		alert(`Bought ${buyCountRef.current} products for € ${currentPrice} each`);
			  	}}
			  >
			  	BUY
			  </Button>
        </>
  );
}
