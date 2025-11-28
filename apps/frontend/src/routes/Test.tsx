import { useState } from "react";
import Button from "../components/Button";
import { Switch } from "../components/Switch";

export default function Test() {
	const [buttonsEnabled, setButtonsEnabled] = useState<boolean>(true);

	return (
		<>
			<table>
				{["contained", "outlined", "text"].map(variant => (
					<tr>
						{["brand", "success", "warning", "error"].map(color => (
							<Button
								variant={variant as any}
								color={color as any}
								disabled={!buttonsEnabled}
							>
								Button
							</Button>
						))}
					</tr>
				))}
			</table>
			<Switch enabled={buttonsEnabled} onClick={() => setButtonsEnabled(v => !v)}/>
		</>
	);
}
