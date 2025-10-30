import React, { JSX, lazy } from "react";

const Home = lazy(() => import("./Home"));
const Clock = lazy(() => import("./Clock"));
const Auctions = lazy(() => import("./Auctions"));
const PendingAuction = lazy(() => import("./PendingAuction"));

export default {
	"/": Home,
	"/clock/:auctionId": Clock,
	"/auctions": Auctions,
	"/auctions/pending": PendingAuction
} as { [path: string]: React.LazyExoticComponent<() => JSX.Element> };
