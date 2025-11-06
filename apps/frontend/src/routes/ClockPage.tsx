import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import Clock from "../components/Clock";
import ProductView from "../components/ProductView";
import Throbber from "../components/Throbber";
import { API_URL, Auction, Product, useAPI } from "../lib/api";
import { useTime } from "../lib/util";
import NotFound from "./NotFound";
import Pending from "./Pending";
import "./styles/ClockPage.css";
import EndedAuction from "../components/EndedAuction";

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

export class AuctionState {
	price: string;
	remainingTime: number;
	fmtedRemainingTime: string;
	progress: number;
	isOver: boolean;
}

export default function ClockPage() {
	const { auctionId } = useParams();
	const auction = useAPI<Auction>("/auction/" + auctionId);
	const product = useAPI<Product>(auction ? "/product/" + auction.productId : null);

	const [isAuctionOver, setIsAuctionOver] = useState<boolean>(false);
	const auctionState = useMemo(() => {
		return new AuctionState();
	}, []);

	useEffect(() => {
		fetch(API_URL + "/auction/" + auction?.id, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify([{ op: "replace", path: "/startingTime", value: Math.round(Date.now() + 5000) }])
		}).then(() => console.log("patched"));
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

	if (!isAuctionOver) {
		if (auctionProgress > 1) {
			setIsAuctionOver(true);
			auctionState.isOver = true;
		}

		auctionState.progress = auctionProgress;
		auctionState.price = Math.min(
			Math.max(lerp(auction.startingPrice, auction.minimumPrice, auctionState.progress), auction.minimumPrice),
			auction.startingPrice
		).toFixed(2);

		auctionState.remainingTime = auctionLenMillis - elapsedTime;
		auctionState.fmtedRemainingTime = auctionState.remainingTime > auctionLenMillis ?
			formatDuration(0) :
			formatDuration(auctionState.remainingTime);
	}

	return (
		<div className={"base-container"}>
			{isAuctionOver ?
				<EndedAuction id={auction.id}/> :
				(
					<div className={"live-auction-container"}>
						<div className={"clock-container"}>
							{auctionState.progress < 0 ?
								(
									<Pending description={"This auction has yet to start."}
										startingPoint={formatStartCountDown(startingTime ? startingTime : 0,
											currentTime)}/>
								) :
								<Clock auctionState={auctionState} setIsAuctionOver={setIsAuctionOver}/>}
						</div>

						<div className={"container-separator"}/>

						<div className={"product-container"}>
							{product == null ? <Throbber/> : <ProductView product={product}/>}
						</div>
					</div>
				)}
		</div>
	);
}
