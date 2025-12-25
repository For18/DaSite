import useAuth from "@/AuthProvider";
import Footer from "@component/Footer";
import TopBar from "@component/TopBar";
import { Routes } from "@route/Routes";
import { type PropsWithChildren } from "react";
import { useLocation } from "react-router";
import styles from "./Layout.module.scss";

export default function Layout({ children }: PropsWithChildren) {
	const location = useLocation();
	const homepage = ["/"];
	const { user, role } = useAuth();

	let hyperlinksToRender: Record<string, string>[] = [
		{ title: "Home", link: Routes.Pages.Home }
	];

	if (!role) hyperlinksToRender.push({ title: "Login", link: Routes.Pages.Login });
	else {
		hyperlinksToRender.push(
			{ title: "Auctions", link: Routes.Pages.Auctions.Base },
			{ title: "Profile", link: user ? Routes.Pages.Profile(user.id) : null }
		);
		if (role == "Admin" || role == "AuctionMaster") {
			hyperlinksToRender.push(
				{ title: "PendingAuctions", link: Routes.Pages.Auctions.Pending },
				{ title: "CreateAuction", link: Routes.Pages.Auctions.Create },
				{ title: "CreateProduct", link: Routes.Pages.CreateProduct }
			);
		}
	}

	const isHomepage = homepage.includes(location.pathname);

	return (
		<div className={styles.container}>
			<TopBar
				links={Object.fromEntries(
					hyperlinksToRender.filter(link => link.link != null).map(link => [link.title, link.link])
				)}
			/>
			<main className={isHomepage ? styles.homepageArticle : styles.article}>
				{children}
			</main>
			<Footer/>
		</div>
	);
}
