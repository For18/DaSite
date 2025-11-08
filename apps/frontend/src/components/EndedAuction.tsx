import { Link } from "react-router";
import styles from "./styles/EndedAuction.module.scss";

export default function EndedAuction({ id }: { id: number }) {
	const nextAuctionId = id + 1;

	return (
		<div className={styles['end-container']}>
			<h2 className={styles.header}>
				This Auction is Over
			</h2>

			<p className={styles.paragraph}>
				You can view the pending auction or the next one below.
			</p>

			<div className={styles['link-container']}>
				<Link
					className={styles['link pending-auctions']}
					to={`/auctions/pending`}
				>
					Pending Auction
				</Link>

				<Link
					className={styles['link next-auction']}
					to={`/clock/${nextAuctionId}`}
				>
					Next Auction
				</Link>
			</div>
		</div>
	);
}
