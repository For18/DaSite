import { type PropsWithChildren } from "react";
import { useLocation } from "react-router";
import { Routes } from "../../routes/Routes";
import Footer from "../Footer";
import styles from "./Layout.module.scss";
import TopBar from "../TopBar";

export default function Layout({ children }: PropsWithChildren) {
	const location = useLocation();
	const homepage = ["/"];

	const isHomepage = homepage.includes(location.pathname);

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
			<main className={isHomepage ? styles.homepageArticle : styles.article}>
				{children}
			</main>
			<Footer/>
		</div>
	);
}
