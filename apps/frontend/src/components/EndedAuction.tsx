import { Link } from "react-router";
import "./styles/EndedAuction.css";

export default function EndedAuction({ id }: { id: number }) {
	const nextAuctionId = id + 1;

	return (
		<div className={"base-container"}>
			<h2 className={"header"}>
				This Auction is Over
			</h2>

			<p className={"paragraph"}>
				You can view the pending auction or the next one below.
			</p>

			<div className={"link-container"}>
				<Link
					className={"link pending-auctions"}
					to={`/auctions/pending`}
				>
					Pending Auction
				</Link>

				<Link
					className={"link next-auction"}
					to={`/clock/${nextAuctionId}`}
				>
					Next Auction
				</Link>
			</div>
		</div>
	);
}
