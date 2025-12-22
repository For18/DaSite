import { type ReactElement, useEffect, useRef, useState } from "react";
import { useMousePosition } from "../../lib/util";
import styles from "./Slider.module.scss";

export interface SliderProps { // TODO: Add direction prop (aria-direction, keybinds & CSS adjustments)
	min: number;
	max: number;
	value: number;
	onChange?: (value: number) => void;
	valueText?: string;
	labelledBy?: string;
	step?: number;
	marks?: boolean | number[] | { [value: number]: ReactElement };
	width?: string;
	disabled?: boolean;
	// tooltip?: boolean | ((value: number) => string); // implement when tooltip component is added
}

export default function Slider(
	{ min, max, value, onChange, valueText, labelledBy, step, marks = false, width, disabled = false }: SliderProps
) {
	const [dragging, setDragging] = useState<boolean>(false);
	const [mouseX, mouseY] = useMousePosition();
	const rectRef = useRef<HTMLDivElement>(null);

	const range = max - min;

	function setValue(value: number) {
		if (onChange == null) return;
		if (value > max) value = max;
		else if (value < min) value = min;
		if (step != null) value = Math.round((value - min) / step) * step + min;
		onChange(value);
	}

	function updateValueFromMouse() {
		if (disabled) return;
		if (!dragging) return;
		if (rectRef.current == null) return;
		const barRect = rectRef.current.getBoundingClientRect();
		const progress = (mouseX - barRect.x) / barRect.width;
		let value = progress * range + min;
		setValue(value);
	}
	useEffect(updateValueFromMouse, [mouseX]);

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
		<div className={styles.container} style={{ width }} role="slider" aria-valuemin={min} aria-valuemax={max}
			aria-valuenow={value} aria-disabled={disabled} aria-valuetext={valueText} aria-labelledby={labelledBy}
		>
			<div className={styles.bar} onMouseDown={e => {
				e.stopPropagation();
				e.preventDefault();
				drag();
				updateValueFromMouse();
			}}>
				<div className={styles.fill} style={{ "--fill": progress } as any}/>
			</div>
			<div className={styles.handle + (dragging ? " " + styles.dragging : "")}
				style={{ "--position": progress } as any} onMouseDown={e => {
				e.stopPropagation();
				e.preventDefault();
				if (e.button === 0) drag();
			}} tabIndex={0} onKeyDown={e => {
				if (onChange == null) return;
				if (disabled) return;
				let captured = true;
				switch (e.key) {
					case "ArrowLeft":
					case "ArrowDown":
						setValue(value - (step ?? 1));
						break;
					case "ArrowRight":
					case "ArrowUp":
						setValue(value + (step ?? 1));
						break;
					case "Home":
						setValue(min);
						break;
					case "End":
						setValue(max);
						break;
					case "PageUp":
						if (step != null) setValue(Math.min(value + step * 10, max));
						break;
					case "PageDown":
						if (step != null) setValue(Math.max(value - step * 10, min));
						break;
					default:
						captured = false;
				}
				if (captured) {
					e.preventDefault();
					e.stopPropagation();
				}
			}}>
				<div className={styles.fill}/>
			</div>
			<div className={styles.rect} ref={rectRef}/>
		</div>
	);
}
