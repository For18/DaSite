import { useCallback, useEffect, useState } from "react";
import Button from "../components/Button";
import { Switch } from "../components/Switch";
import LabeledContainer from "../components/LabeledContainer";
import Typography from "../components/Typography";
import Checkbox from "../components/Checkbox";
import Input from "../components/Input";

export default function Test() {
	useEffect(() => {
		document.title = "For18 - Test";
	}, []);

	const [buttonsEnabled, setButtonsEnabled] = useState<boolean>(true);
	const [buttonsPressed, setButtonsPressed] = useState<number>(0);
	const incrementButtonsPressed = useCallback(() => {
		setButtonsPressed(n => n + 1)
	}, []);
	const [checked, setChecked] = useState<boolean>(false);

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
			<LabeledContainer text="Enable buttons" color={buttonsEnabled ? "primary" : "secondary"} id="switch">
				<Switch enabled={buttonsEnabled} onClick={() => setButtonsEnabled(v => !v)} labelledby="switch"/>
			</LabeledContainer>
			<LabeledContainer text="Disable fields" id="checkbox">
				<Checkbox checked={checked} onClick={() => setChecked(v => !v)} labelledby="checkbox"/>
			</LabeledContainer>
			{["text", "password", "date", "datetime-local", "email", "number", "password", "tel", "time", "url"].map(type => (
				<LabeledContainer text={type} color={checked ? "secondary" : "primary"} id={`field-${type}`}>
					<Input type={type as any} placeholder="placeholder" disabled={checked} labelledby={`field-${type}`}/>
				</LabeledContainer>
			))}
		</>
	);
}
