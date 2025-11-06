import { PropsWithChildren } from "react";
import Footer from "./Footer";
import TopBar from "./TopBar";
import styles from "./Layout.module.scss";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<div className={styles.container}>
			<TopBar
				links={{
					Home: "/",
					Auctions: "/auctions"
				}}
			/>
			<article>
				{children}
			</article>
			<Footer/>
		</div>
	);
}
