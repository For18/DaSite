import { PropsWithChildren, useId, useLayoutEffect, useRef, useState } from "react";
import { useScreenSize } from "../lib/util";
import styles from "./Accordion.module.scss";
import Typography from "./Typography";

export interface AccordionProps extends PropsWithChildren {
	title: string;
	open: boolean;
	onToggle?: (isOpen: boolean) => void;
}

export default function Accordion({ title, open = false, onToggle, children }: AccordionProps) {
	const innerContentRef = useRef<HTMLDivElement>(null);
	const [contentHeight, setContentHeight] = useState<number>(0);
	const [screenX, screenY] = useScreenSize();
	const barRef = useRef<HTMLDivElement>(null);
	const contentId = useId();

	function toggle() {
		onToggle?.(!open);
	}

	useLayoutEffect(() => {
		if (innerContentRef.current == null) return;
		setContentHeight(innerContentRef.current.getBoundingClientRect().height);
	}, [open, screenX, screenY, innerContentRef.current, children]);

	return (
		<div className={styles.container + (open ? " " + styles.open : "")} aria-label={title}>
			<div className={styles.bar} ref={barRef} onClick={toggle} aria-owns={contentId} tabIndex={0}
				onKeyDown={e => {
					if (e.key !== "Enter" && e.key !== " ") return;
					e.preventDefault();
					toggle();
				}}
			>
				<Typography heading={3}>{title}</Typography>
				<svg viewBox="-7 -10 114 110" className={styles.arrow}>
					<path d="M100 25 L50 75 L0 25"/>
				</svg>
			</div>
			<div className={styles.content} style={{ "--content-height": contentHeight } as any} inert={!open}
				aria-expanded={open} id={contentId} onKeyDown={e => {
				if (e.key !== "PageUp") return;
				e.preventDefault();
				barRef.current?.focus();
			}}>
				<div className={styles.inner} ref={innerContentRef}>
					{children}
				</div>
			</div>
		</div>
	);
}
