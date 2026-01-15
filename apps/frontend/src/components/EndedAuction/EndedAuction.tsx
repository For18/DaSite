import useAuth from "@/AuthProvider";
import { useAPI } from "@/lib/api";
import Button from "@component/Button";
import Typography from "@component/Typography";
import useGoto from "@lib/hooks/useGoto";
import { Routes } from "@route/Routes";
import styles from "./EndedAuction.module.scss";

export default function EndedAuction({ currentAuctionId }: { currentAuctionId?: number }) {
	const nextAuctionId = useAPI<number>(currentAuctionId == null ? null : Routes.Auction.GetNext);
	const { role } = useAuth();

	const goto = useGoto();
	return (
		<div className={styles.endContainer}>
			<Typography className={styles.header} heading={1}>
				This auction is over
			</Typography>

			<div className={styles.linkContainer}>
				{!["AuctionMaster", "Admin"].includes(role) ? null : (
					<Button
						onClick={() => goto(Routes.Pages.Auctions.PendingItems)}
						variant="outlined"
					>
						Pending Auctions
					</Button>
				)}

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
