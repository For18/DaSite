import { Typography } from "@mui/material";
import { Link } from "react-router";
import styles from "./styles/EndedAuction.module.scss";

export default function EndedAuction({ id }: { id: number }) {
	// TODO: add 'nextAuction' endpoint
	const nextAuctionId = id + 1;

	return (
		<div className={styles["end-container"]}>
			<Typography className={styles.header} color="textPrimary">
				This Auction is Over
			</Typography>

			<Typography className={styles.paragraph} color="textPrimary">
				You can view the pending auction or the next one below.
			</Typography>

			<div className={styles["link-container"]}>
				<Link
					className={styles["link pending-auctions"]}
					to={`/auctions/pending`}
				>
					Pending Auction
				</Link>

				<Link
					className={styles["link next-auction"]}
					to={`/clock/${nextAuctionId}`}
				>
					Next Auction
				</Link>
			</div>
		</div>
	);
}
