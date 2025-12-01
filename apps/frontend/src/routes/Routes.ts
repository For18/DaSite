import { type JSX, lazy, type LazyExoticComponent } from "react";

const Home = lazy(() => import("./Home"));
const Clock = lazy(() => import("./ClockPage"));
const Auctions = lazy(() => import("./Auctions"));
const PendingAuction = lazy(() => import("./PendingAuction"));
const Profile = lazy(() => import("./Profile"));
const Test = lazy(() => import("./Test"));
const Login = lazy(() => import("./Login"));

export default {
	"/": Home,
	"/clock/:auctionId": Clock,
	"/auctions": Auctions,
	"/auctions/pending": PendingAuction,
	"/profile/:userId": Profile,
	"/test": Test,
	"/login": Login
} as { [path: string]: LazyExoticComponent<() => JSX.Element> };
