import Button from "@component/Button";
import Typography from "@component/Typography";
import { Routes } from "@route/Routes";
import styles from "./EndedAuction.module.scss";
import useGoto from "@lib/hooks/useGoto";

export default function EndedAuction({ id }: { id: number }) {
	// TODO: add 'nextAuction' endpoint
	const nextAuctionId = id + 1;

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
					Pending Auction
				</Button>

				<Button
					onClick={() => goto(Routes.Pages.Clock(nextAuctionId))}
					variant="outlined"
				>
					Next Auction
				</Button>
			</div>
		</div>
	);
}
