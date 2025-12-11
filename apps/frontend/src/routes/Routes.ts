import { type JSX, lazy, type LazyExoticComponent } from "react";

const Home = lazy(() => import("./Home"));
const Clock = lazy(() => import("./ClockPage"));
const Auctions = lazy(() => import("./Auctions"));
const PendingAuction = lazy(() => import("./PendingAuction"));
const Profile = lazy(() => import("./Profile"));
const CreateAuction = lazy(() => import("./CreateAuction"));
const Test = lazy(() => import("./Test"));

export default {
	"/": Home,
	"/clock/:auctionId": Clock,
	"/auctions": Auctions,
	"/auctions/pending": PendingAuction,
	"/profile/:userId": Profile,
	"/auctions/create": CreateAuction
  "/test": Test
} as { [path: string]: React.LazyExoticComponent<() => JSX.Element> };
