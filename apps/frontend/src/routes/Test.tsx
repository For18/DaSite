import { useCallback, useState } from "react";
import Button from "../components/Button";
import { Switch } from "../components/Switch";
import LabeledContainer from "../components/LabeledContainer";
import Typography from "../components/Typography";

export default function Test() {
	const [buttonsEnabled, setButtonsEnabled] = useState<boolean>(true);
	const [buttonsPressed, setButtonsPressed] = useState<number>(0);
	const incrementButtonsPressed = useCallback(() => {
		setButtonsPressed(n => n + 1)
	}, []);

	return (
		<>
			<Typography heading={3}>Buttons pressed: {buttonsPressed}</Typography>
			<table>
				{["contained", "outlined", "text"].map(variant => (
					<tr>
						{["brand", "success", "warning", "error"].map(color => (
							<Button
								variant={variant as any}
								color={color as any}
								disabled={!buttonsEnabled}
								onClick={incrementButtonsPressed}
							>
								Button
							</Button>
						))}
					</tr>
				))}
			</table>
			<LabeledContainer text="Enable buttons" color={buttonsEnabled ? "primary" : "secondary"}>
				<Switch enabled={buttonsEnabled} onClick={() => setButtonsEnabled(v => !v)}/>
			</LabeledContainer>
		</>
	);
}
