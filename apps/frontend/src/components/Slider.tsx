import { ReactElement, useEffect, useRef, useState } from "react";
import styles from "./Slider.module.scss";
import { useMousePosition } from "../lib/util";

export interface SliderProps {
	min: number;
	max: number;
	value: number;
	onChange: (value: number) => void;
	step?: number;
	marks?: boolean | number[] | {[value: number]: ReactElement}
	width?: string;
	disabled?: boolean;
	//tooltip?: boolean | ((value: number) => string); // implement when tooltip component is added
}

export default function Slider({ min, max, value, onChange, step, marks = false, width, disabled = false }: SliderProps) {
	const [dragging, setDragging] = useState<boolean>(false);
	const [mouseX, mouseY] = useMousePosition();
	const rectRef = useRef<HTMLDivElement>(null);

	const range = max - min;

	function updateValue() {
		if (!dragging) return;
		if (rectRef.current == null) return;
		const barRect = rectRef.current.getBoundingClientRect();
		const progress = (mouseX - barRect.x) / barRect.width;
		let value = progress * range + min;
		if (value > max) value = max;
		else if (value < min) value = min;
		if (step != null) value = Math.round((value - min) / step) * step + min;
		onChange(value);
	}
	useEffect(updateValue, [mouseX]);

	function drag() {
		window.addEventListener("mouseup", undrag);
		setDragging(true);
	}
	function undrag() {
		window.removeEventListener("mouseup", undrag);
		setDragging(false);
	}
	useEffect(() => undrag, []);
	
	if (range <= 0) throw new Error("Invalid min/max combination");
	if (step != null && range % step !== 0) throw new Error("Invalid step size; not divisible");

	const progress = (value - min) / range;

	return (
		<div className={styles.container} style={{width}}>
			<div className={styles.bar} onMouseDown={() => {
				drag();
				updateValue();
			}}>
				<div className={styles.fill} style={{"--fill": progress} as any}/>
			</div>
			<div className={styles.handle + (dragging ? " " + styles.dragging : "")} style={{"--position": progress} as any} onMouseDown={drag}>
				<div className={styles.fill}/>
			</div>
			<div className={styles.rect} ref={rectRef}/>
		</div>
	)
}