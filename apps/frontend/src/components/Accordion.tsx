import { PropsWithChildren, useId, useLayoutEffect, useRef, useState } from "react";
import styles from "./Accordion.module.scss";
import Typography from "./Typography";
import { useScreenSize } from "../lib/util";

export interface AccordionProps extends PropsWithChildren {
	title: string;
	open: boolean;
	onToggle?: (isOpen: boolean) => void;
}

export default function Accordion({ title, open = false, onToggle, children }: AccordionProps) {
	const innerContentRef = useRef<HTMLDivElement>(null);
	const [contentHeight, setContentHeight] = useState<number>(0);
	const [screenX, screenY] = useScreenSize();
	const contentId = useId();

	useLayoutEffect(() => {
		if (innerContentRef.current == null) return;
		setContentHeight(innerContentRef.current.getBoundingClientRect().height);
	}, [open, screenX, screenY, innerContentRef.current, children]);

	return (
		<div className={styles.container + (open ? " " + styles.open : "")}>
			<div className={styles.bar} onClick={() => onToggle?.(!open)} aria-owns={contentId}>
				<Typography heading={3}>{title}</Typography>
				<svg viewBox="-10 -10 110 110" className={styles.arrow}>
					<path d="M100 25 L50 75 L0 25"/>
				</svg>
			</div>
			<div className={styles.content} style={{"--content-height": contentHeight} as any} inert={!open} aria-expanded={open} id={contentId}>
				<div className={styles.inner} ref={innerContentRef}>
					{children}
				</div>
			</div>
		</div>
	);
}
