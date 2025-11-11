import { useCallback, useEffect, useState } from "react";
import Button from "../components/Button";
import Typography from "../components/Typography";
import { randomCharacter } from "../lib/util";

export default function Home() {
	const [text, setText] = useState("Hello world");

	useEffect(() => {
		document.title = "For18 - Home";
	});

	const updateText = useCallback(() => {
		setText(text + randomCharacter());
	}, [text]);

	return (
		<>
			<Typography heading={1}>
				{text}
			</Typography>
			<Typography>
				"If Hypixel has taught me something, it's that if you have a problem, the answer is slavery" -
				Technoblade (idk when) (bonjour)
			</Typography>
			<table>
				{["contained", "outlined", "text"].map(variant => (
					<tr key={variant}>
						{["brand", "success", "warning", "error"].map(color => (
							<td key={color}>
								<Button
									variant={variant as any}
									color={color as any}
									onClick={updateText}
									disabled={text.length >= 50}
								>
									Button
								</Button>
							</td>
						))}
					</tr>
				))}
			</table>
			<Button
				variant="contained"
				color="error"
				onClick={() => setText("Hello world")}
			>
				Reset
			</Button>
		</>
	);
}
