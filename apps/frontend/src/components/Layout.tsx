import { PropsWithChildren } from "react";
import PendingAuction from "../routes/PendingAuction";
import Footer from "./Footer";
import styles from "./Layout.module.scss";
import TopBar from "./TopBar";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<div className={styles.container}>
			<TopBar
				links={{
					Home: "/",
					Auctions: "/auctions",
					PendingAuction: "/auctions/pending",
					Profile: "/profile/1"
				}}
			/>
			<article className={styles.article}>
				{children}
			</article>
			<Footer/>
		</div>
	);
}
