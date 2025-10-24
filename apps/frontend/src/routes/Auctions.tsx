import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { randomCharacter } from "../lib/util";

export default function Auctions() {
	const [text, setText] = useState("Live Auctions");

	useEffect(() => {
		document.title = "For18 - auction";
	});

	return (
		<>
			<Header level={1} color="textPrimary">
				{text}
			</Header>
			<Typography color="textPrimary">
				Here's where you'd see the auction... if there was one (under construction)
			</Typography>
			<Button
				variant="contained"
				onClick={() => {
					setText(text + randomCharacter());
				}}
				disabled={text.length >= 50}
			>
				Update title
			</Button>
		</>
	);
}
