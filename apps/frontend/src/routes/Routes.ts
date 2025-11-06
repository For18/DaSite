import React, { JSX, lazy } from "react";

const Home = lazy(() => import("./Home"));
const Clock = lazy(() => import("./Clock"));
const Auctions = lazy(() => import("./Auctions"));
const Profile = lazy(() => import("./Profile"));

export default {
	"/": Home,
	"/clock/:auctionId": Clock,
	"/auctions": Auctions,
	"/profile/:userId": Profile
} as { [path: string]: React.LazyExoticComponent<() => JSX.Element> };
