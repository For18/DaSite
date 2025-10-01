import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { randomCharacter } from "../util";

export default function Home() {
	const [text, setText] = useState("Hello world");

	useEffect(() => {
		document.title = "For18 - Home";
	});

	return (
		<>
			<h1>{text}</h1>
			<h2>test</h2>
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
