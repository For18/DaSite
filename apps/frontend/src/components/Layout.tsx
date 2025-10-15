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
					Auction: "/auction"
				}}
			/>
			<article
				style={{
					alignSelf: "center",
					width: "100vw"
				}}
			>
				{children}
			</article>
			<Footer/>
		</div>
	);
}
