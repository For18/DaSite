import { useEffect, useMemo} from "react";
import { useParams } from "react-router";
import Clock from "../components/Clock";
import ProductView from "../components/ProductView";
import Throbber from "../components/Throbber";
import { Auction, Product, useAPI, API_URL } from "../lib/api";
import { useTime } from "../lib/util";
import NotFound from "./NotFound";
import "./styles/ClockPage.css";

function lerp(from: number, to: number, t: number): number {
  return from + t * (to - from);
}

function formatDuration(duration: number): string {
    if (duration < 0) return '00:000';
    
    const milliseconds = Math.round(duration % 1000);
    const seconds = Math.floor(duration / 1000) % 60;

    return `${(seconds < 10 ? "0" : "") + seconds}:${(milliseconds < 100 ? "0" : "") + (milliseconds < 10 ? "0" : "") + milliseconds}`;
}

export default function ClockPage() {
	const { auctionId } = useParams();
	const auction = useAPI<Auction>("/auction/" + auctionId);
	const product = useAPI<Product>(auction ? "/product/" + auction.productId : null);

  useEffect(() => {
      fetch(API_URL + "/auction/" + auction?.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify([{op: "replace", path: "/startingTime", value: Math.round(Date.now() + 5000)}])
      }).then(() => console.log("patched"))
  }, [auction]);
  
	const startingTime = useMemo(() => {
      return auction?.startingTime; 
  }, [auction]);

	const currentTime = useTime();
  const auctionLenMillis = auction ? auction?.length * 1000 : 1;

  const elapsedTime = (auction && startingTime != null) ? currentTime - startingTime : 0;

  const auctionProgress = (auction == null) ? 0 : elapsedTime / auctionLenMillis;

	if (auction === undefined) return <NotFound/>;
	if (auction === null) return <Throbber/>;
	if (product === null) return <Throbber/>;

  const currentPrice = Math.min(Math.max(lerp(auction.startingPrice, auction.minimumPrice , auctionProgress), auction.minimumPrice), auction.startingPrice).toFixed(2);
  const remainingTime = auctionLenMillis - elapsedTime;
  const formattedTime = remainingTime > auctionLenMillis ? formatDuration(0) : formatDuration(remainingTime);

	return (
		<div className={"base-container"}>
			<div className={"clock-container"}>
				<Clock price={currentPrice} duration={formattedTime} progress={auctionProgress}/>
			</div>

      <div className={"container-separator"}/>

			<div className={"product-container"}>
				{product == null ? <Throbber/> : <ProductView product={product}/>}
			</div>
		</div>
	);
}
