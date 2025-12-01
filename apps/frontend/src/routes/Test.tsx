import { useCallback, useEffect, useState } from "react";
import Accordion from "../components/Accordion";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import Input from "../components/Input";
import LabeledContainer from "../components/LabeledContainer";
import Slider from "../components/Slider";
import { Switch } from "../components/Switch";
import Typography from "../components/Typography";

export default function Test() {
	useEffect(() => {
		document.title = "For18 - Test";
	}, []);

	const [buttonsEnabled, setButtonsEnabled] = useState<boolean>(true);
	const [buttonsPressed, setButtonsPressed] = useState<number>(0);
	const incrementButtonsPressed = useCallback(() => {
		setButtonsPressed(n => n + 1);
	}, []);
	const [checked, setChecked] = useState<boolean>(false);
	const [sliderValue, setSliderValue] = useState<number>(50);
	const [inputsOpen, setInputsOpen] = useState<boolean>(false);
	const [buttonsOpen, setButtonsOpen] = useState<boolean>(false);
	const [sliderOpen, setSliderOpen] = useState<boolean>(false);

	return (
		<>
			<Accordion title="Buttons" open={buttonsOpen} onToggle={setButtonsOpen}>
				<Typography heading={3}>Buttons pressed: {buttonsPressed}</Typography>
				<table>
					<tbody>
						{["contained", "outlined", "text"].map(variant => (
							<tr key={variant}>
								{["brand", "success", "warning", "error"].map(color => (
									<td key={color}>
										<Button
											variant={variant as any}
											color={color as any}
											disabled={!buttonsEnabled}
											onClick={incrementButtonsPressed}
										>
											Button
										</Button>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
				<LabeledContainer text="Enable buttons" color={buttonsEnabled ? "primary" : "secondary"} id="switch">
					<Switch enabled={buttonsEnabled} onClick={() => setButtonsEnabled(v => !v)} labelledby="switch"/>
				</LabeledContainer>
			</Accordion>
			<Accordion title="Inputs" open={inputsOpen} onToggle={setInputsOpen}>
				<LabeledContainer text="Disable fields" id="checkbox">
					<Checkbox checked={checked} onClick={() => setChecked(v => !v)} labelledby="checkbox"/>
				</LabeledContainer>
				{["text", "password", "date", "datetime-local", "email", "number", "tel", "time", "url"].map(type => (
					<LabeledContainer key={type} text={type} color={checked ? "secondary" : "primary"}
						id={`field-${type}`}
					>
						<Input type={type as any} placeholder="placeholder" disabled={checked}
							labelledby={`field-${type}`}/>
					</LabeledContainer>
				))}
			</Accordion>
			<Accordion title="Slider" open={sliderOpen} onToggle={setSliderOpen}>
				<Slider min={0} max={100} value={sliderValue} onChange={setSliderValue} width="500px" step={10}/>
			</Accordion>
		</>
	);
}
