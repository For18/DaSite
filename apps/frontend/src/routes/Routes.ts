import React, { JSX, lazy } from "react";

const Home = lazy(() => import("./Home"));
const Clock = lazy(() => import("./Clock"));
const Auctions = lazy(() => import("./Auctions"));

export default {
	"/": Home,
	"/clock/:auctionId": Clock,
	"/auctions": Auctions
} as { [path: string]: React.LazyExoticComponent<() => JSX.Element> };
