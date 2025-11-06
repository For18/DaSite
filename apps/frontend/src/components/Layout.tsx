import { useTheme } from "@mui/material/styles";
import { PropsWithChildren } from "react";
import Footer from "./Footer";
import TopBar from "./TopBar";

export default function Layout({ children }: PropsWithChildren) {
	const theme = useTheme();

	return (
		<div
			style={{
				backgroundColor: theme.palette.background.default,
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between"
			}}
		>
			<TopBar
				links={{
					Home: "/",
					Auctions: "/auctions"
				}}
			/>
			<article
				style={{
					alignSelf: "center",
					padding: "20px"
				}}
			>
				{children}
			</article>
			<Footer/>
		</div>
	);
}
