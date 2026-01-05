import Footer from "@component/Footer";
import TopBar from "@component/TopBar";
import { Routes } from "@route/Routes";
import { type PropsWithChildren } from "react";
import styles from "./Layout.module.scss";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<div className={styles.container}>
			<TopBar
				links={{
					Home: Routes.Pages.Home,
					Auctions: Routes.Pages.Auctions.Base,
					PendingAuction: Routes.Pages.Auctions.Pending,
					Profile: Routes.Pages.Profile(1),
					CreateAuction: Routes.Pages.Auctions.Create,
					Login: Routes.Pages.Login
				}}
			/>
			<main className={styles.article}>
				{children}
			</main>
			<Footer/>
		</div>
	);
}
