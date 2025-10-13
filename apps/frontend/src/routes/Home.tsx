import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { randomCharacter } from "../lib/util";
import Typography from "@mui/material/Typography";
import Header from "../components/Header";

export default function Home() {
	const [text, setText] = useState("Hello world");

	useEffect(() => {
		document.title = "For18 - Home";
	});

	return (
		<>
			<Header level={1} color="textPrimary">
				{text}
			</Header>
			<Typography color="textPrimary">"If Hypixel has taught me something, it's that if you have a problem, the answer is slavery" - Technoblade (idk when) (test)</Typography>
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