import { useEffect, useState } from "react";
import Button from "../components/Button";
import Typography from "../components/Typography";
import { randomCharacter } from "../lib/util";

export default function Home() {
	const [text, setText] = useState("Hello world");

	useEffect(() => {
		document.title = "For18 - Home";
	});

	return (
		<>
			<Typography heading={1}>
				{text}
			</Typography>
			<Typography>
				"If Hypixel has taught me something, it's that if you have a problem, the answer is slavery" -
				Technoblade (idk when) (bonjour)
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
