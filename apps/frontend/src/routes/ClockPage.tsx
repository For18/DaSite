import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router";
import Clock from "../components/Clock";
import ProductView from "../components/ProductView";
import Throbber from "../components/Throbber";
import { Auction, Product, useAPI } from "../lib/api";
import { useTime } from "../lib/util";
import NotFound from "./NotFound";
import "./styles/ClockPage.css"

export default function ClockPage() {
  const { auctionId } = useParams();
  const auction = useAPI<Auction>("/auction/" + auctionId);
  const product = useAPI<Product>(auction ? "/product/" + auction.productId : null);

  const [startingTime, setStartingTime] = useState<number | null>(null);
  const currentTime = useTime();
  
  useEffect(() => {
    if (auction && !startingTime) {
      setStartingTime(Date.now());
    }
  }, [auction, startingTime]);

  const remainingTime = auction && startingTime ? Math.max(startingTime + auction.length * 1000 - currentTime, 0) : 0;

  const auctionProgress = useMemo(() => {
    if (!auction || remainingTime <= 0) return 0;
    return (remainingTime / (auction.length * 1000)) * 100;
  }, [remainingTime, auction]);

  const currentPrice = useMemo(() => {
      if (!auction || !startingTime) return "";
      const price = Math.floor
        ((auction.minimumPrice + (auction.startingPrice - auction.minimumPrice) * (remainingTime / (auction.length * 1000))) * 100) / 100;

      return price.toFixed(2);
  }, [auctionProgress]);

  if (auction === undefined) return <NotFound />;
  if (auction === null) return <Throbber />;
  if (product === null) return <Throbber />;

  const remainingSeconds = Math.floor(remainingTime / 1000);
  const remainingMilliSec = remainingTime % 1000;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  const formattedMilliseconds = remainingMilliSec < 100 ? `0${remainingMilliSec}`.padStart(3, '0') : `${remainingMilliSec}`;

  return (
    <div className={"base-container"}>
      <div className={"clock-container"}>
        <Clock price={currentPrice} seconds={formattedSeconds} milliseconds={formattedMilliseconds} progress={auctionProgress} />
      </div>

      <div className={"product-container"}>
        {product == null ? <Throbber /> : <ProductView product={product} />}
      </div>
    </div>
  );
}
