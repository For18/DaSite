import Button from "@component/Button";
import Typography from "@component/Typography";
import { Routes } from "@route/Routes";
import styles from "./EndedAuction.module.scss";
import useGoto from "@lib/hooks/useGoto";
import { useAPI } from "@/lib/api";

export default function EndedAuction({ currentAuctionId }: { currentAuctionId?: number }) {
	const nextAuctionId = useAPI<number>(currentAuctionId == null ? null : Routes.Auction.GetNext);

	const goto = useGoto();
	return (
		<div className={styles.endContainer}>
			<Typography className={styles.header} heading={1}>
				This Auction is Over
			</Typography>

			<Typography className={styles.paragraph}>
				You can view the pending auction or the next one below.
			</Typography>

			<div className={styles.linkContainer}>
				<Button
					onClick={() => goto(Routes.Pages.Auctions.Pending)}
					variant="outlined"
				>
					Pending Auctions
				</Button>

				<Button
					onClick={() => goto(Routes.Pages.Clock(nextAuctionId))}
					disabled={nextAuctionId == null}
					variant="outlined"
				>
					Next Auction
				</Button>
			</div>
		</div>
	);
}
