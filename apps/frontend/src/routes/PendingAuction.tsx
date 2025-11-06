import { useEffect, useState } from "react";
import Button from "../components/Button";
import Typography from "../components/Typography";
import { randomCharacter } from "../lib/util";

export default function PendingAuction() {
	const [text, setText] = useState("Pending Auctions");

	useEffect(() => {
		document.title = "For18 - Pending Auction";
	});

	return (
		<>
			<Typography heading={1}>
				{text}
			</Typography>
			<Typography>"If that's beef, then I'm from Bangladesh"</Typography>
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
