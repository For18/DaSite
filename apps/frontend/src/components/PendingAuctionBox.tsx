import { Auction } from "../lib/api";

export default function PendingAuctionBox({ auction }: {
	auction: Auction;
}) {
	return (
		<div style={{
			backgroundColor: "red",
			width: "100%",
			aspectRatio: "4/1"
		}}>
			<div></div>
			Pending Auction Box
		</div>
	);
}
