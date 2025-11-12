import { useNavigate } from "react-router";
import styles from "./EndedAuction.module.scss";
import Typography from "./Typography";
import Button from "./Button";

export default function EndedAuction({ id }: { id: number }) {
	// TODO: add 'nextAuction' endpoint
	const nextAuctionId = id + 1;

  const navigate = useNavigate();
	return (
		<div className={styles["end-container"]}>
			<Typography className={styles.header}>
				This Auction is Over
			</Typography>

			<Typography className={styles.paragraph}>
				You can view the pending auction or the next one below.
			</Typography>

			<div className={styles["link-container"]}>
				<Button 
          onClick={() => navigate("/auctions/pending")}
          variant="contained"
          >
					Pending Auction
				</Button>

				<Button 
          onClick={() => navigate(`/clock/${nextAuctionId}`)}
          variant="contained" 
          >
					Next Auction
				</Button>
			</div>
		</div>
	);
}
