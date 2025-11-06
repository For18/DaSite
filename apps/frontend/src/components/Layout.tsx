import { useTheme } from "@mui/material/styles";
import { PropsWithChildren } from "react";
import Footer from "./Footer";
import TopBar from "./TopBar";
import styles from "./Layout.module.scss";

export default function Layout({ children }: PropsWithChildren) {
	const theme = useTheme();

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
