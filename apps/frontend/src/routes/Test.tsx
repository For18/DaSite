import { SmartAccordion } from "@component/Accordion";
import Button from "@component/Button";
import Checkbox from "@component/Checkbox";
import Divider from "@component/Divider";
import Input from "@component/Input";
import LabeledContainer from "@component/LabeledContainer";
import Modal from "@component/Modal/Modal";
import { Option, Select } from "@component/Select";
import Slider from "@component/Slider";
import { type Status, StatusDisplay } from "@component/StatusDisplay";
import Switch from "@component/Switch";
import Table from "@component/Table";
import Typography from "@component/Typography";
import { pickRandom, range, sleep } from "@lib/util";
import { useCallback, useEffect, useState } from "react";

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
	const [selectValue, setSelectValue] = useState<string | null>(null);
	const [status, setStatus] = useState<Status>({ type: "none", label: "" });
	const [modalOpen, setModalOpen] = useState<boolean>(false);

	return (
		<>
			<SmartAccordion title="Buttons">
				<Typography heading={3}>Buttons pressed: {buttonsPressed}</Typography>
				<table style={{
					margin: "var(--spacing)",
					borderCollapse: "collapse"
				}}>
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
			</SmartAccordion>
			<SmartAccordion title="Inputs">
				<LabeledContainer text="Disable fields" id="checkbox">
					<Checkbox checked={checked} onClick={() => setChecked(v => !v)} labelledby="checkbox"/>
				</LabeledContainer>
				{["text", "textfield", "password", "date", "datetime-local", "email", "number", "tel", "time", "url"]
					.map(type => (
						<LabeledContainer key={type} text={type} color={checked ? "secondary" : "primary"}
							id={`field-${type}`}
						>
							<Input type={type as any} placeholder="placeholder" disabled={checked}
								labelledby={`field-${type}`}/>
						</LabeledContainer>
					))}
			</SmartAccordion>
			<SmartAccordion title="Slider">
				<Slider min={0} max={100} value={sliderValue} step={1} onChange={setSliderValue} width="500px"
					valueText={sliderValue + "%"}/>
				<Typography>Value: {sliderValue}</Typography>
			</SmartAccordion>
			<SmartAccordion title="Text">
				<Typography heading={1}>Heading 1</Typography>
				<Typography heading={2}>Heading 2</Typography>
				<Typography heading={3}>Heading 3</Typography>
				<Typography heading={4}>Heading 4</Typography>
				<Typography heading={5}>Heading 5</Typography>
				<Typography heading={6}>Heading 6</Typography>
				<Divider label="LABEL"/>
				<Typography color="secondary">
					Verecundia laborum apto ullam urbs cupio carcer. Tero videlicet comitatus supellex acerbitas
					spoliatio censura. Suspendo vaco vereor vos adinventitias celer adnuo. Velum vespillo tibi sono
					suscipio vapulus dolores suffragium animi. Officiis denuncio tergum appositus animadverto vero
					excepturi veniam. Pecco supra altus similique labore aranea odit.
				</Typography>
			</SmartAccordion>
			<SmartAccordion title="Select">
				<Select value={selectValue} onChange={setSelectValue} placeholder="Choose an option">
					{range(20).map(i => <Option key={i} value={`option${i + 1}`}>{`Option ${i + 1}`}</Option>)}
				</Select>
			</SmartAccordion>
			<SmartAccordion title="Status display">
				<Button onClick={async () => {
					setStatus({
						type: "progress",
						label: "Processing..."
					});
					await sleep(2000);
					setStatus(pickRandom<Status>([
						{
							type: "success",
							label: "Success!"
						},
						{
							type: "error",
							label: "Error"
						}
					]));
				}}>
					Test
				</Button>
				<StatusDisplay status={status}/>
			</SmartAccordion>
			<SmartAccordion title="Modal">
				<Button onClick={() => setModalOpen(true)} disabled={modalOpen}>Open modal</Button>
				<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
					<Typography heading={3}>This is a modal</Typography>
					<Button onClick={() => setModalOpen(false)}>Close modal</Button>
				</Modal>
			</SmartAccordion>
			<SmartAccordion title="Table">
				<Table>
					{range(11).map(y => (
						<tr key={y}>
							{range(11).map(x => {
								const nX = x;
								const nY = y;

								if (x === 0 && y === 0) return <th></th>;
								else if (x === 0) return <th>{nY}</th>;
								else if (y === 0) return <th>{nX}</th>;

								return <td>{nX * nY}</td>;
							})}
						</tr>
					))}
				</Table>
			</SmartAccordion>
		</>
	);
}
