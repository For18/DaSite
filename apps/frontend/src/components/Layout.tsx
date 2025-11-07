import { PropsWithChildren } from "react";
import Footer from "./Footer";
import styles from "./Layout.module.scss";
import TopBar from "./TopBar";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<div className={styles.container}>
			<TopBar
				links={{
					Home: "/",
					Auctions: "/auctions"
				}}
			/>
			<article className={styles.article}>
				{children}
			</article>
			<Footer/>
		</div>
	);
}
