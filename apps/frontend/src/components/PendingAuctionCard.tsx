import { Auction } from "../lib/api";

export default function PendingAuctionCard({ auction }: {
	auction: Auction;
}) {
	return (
		<div style={{
			backgroundColor: "red",
			width: "100%",
			aspectRatio: "4/1"
		}}>
			<div style={{
				alignSelf: "Left"
			}}>
				<p>Seller: </p>
				<p>Asking price: {auction.startingPrice}</p>
				<p>Amount: {auction.batchSize * auction.count}</p>
			</div>
		</div>
	);
}
