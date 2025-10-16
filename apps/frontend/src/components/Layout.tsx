import TopBar from "./TopBar";
import Footer from "./Footer";
import { PropsWithChildren } from "react";
import { useTheme } from "@mui/material/styles";
import Auctions from "../routes/Auctions";

export default function Layout({ children }: PropsWithChildren) {
	const theme = useTheme();

	return (
		<div
			style={{
				backgroundColor: theme.palette.background.default,
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<TopBar
				links={{
					Home: "/",
					Auctions: "/auctions",
				}}
			/>
			<article
				style={{
					alignSelf: "center",
				}}
			>
				{children}
			</article>
			<Footer />
		</div>
	);
}
