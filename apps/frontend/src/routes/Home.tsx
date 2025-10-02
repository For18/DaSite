import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { randomCharacter } from "../util";
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
			<Typography color="textPrimary">wooooooooooooooooooow</Typography>
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
