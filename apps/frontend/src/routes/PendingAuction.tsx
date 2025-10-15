import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { randomCharacter } from "../lib/util";

export default function PendingAuction() {
	const [text, setText] = useState("Pending Auctions");

	useEffect(() => {
		document.title = "For18 - Pending Auction";
	});

	return (
		<>
			<Header level={1} color="textPrimary">
				{text}
			</Header>
			<Typography color="textPrimary">"If that's beef, then I'm from Bangladesh"</Typography>
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
