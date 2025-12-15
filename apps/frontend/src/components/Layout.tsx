import { PropsWithChildren } from "react";
import { useLocation } from "react-router";
import Footer from "./Footer";
import styles from "./Layout.module.scss";
import TopBar from "./TopBar";

export default function Layout({ children }: PropsWithChildren) {
	const location = useLocation();
	const homepage = ["/"];

	const isHomepage = homepage.includes(location.pathname);

	return (
		<div className={styles.container}>
			<TopBar
				links={{
					Home: "/",
					Auctions: "/auctions",
					PendingAuction: "/auctions/pending",
					Profile: "/profile/1",
					CreateAuction: "/auctions/create",
					Login: "/login"
				}}
			/>
			<article className={isHomepage ? styles.homepageArticle : styles.article}>
				{children}
			</article>
			<Footer/>
		</div>
	);
}
