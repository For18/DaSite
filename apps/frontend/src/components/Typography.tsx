import { createElement, type JSX, type PropsWithChildren, useCallback } from "react";
import { useGoto } from "../lib/util";
import styles from "./Typography.module.scss";

export interface TypographyProps extends PropsWithChildren {
	heading?: 1 | 2 | 3 | 4 | 5 | 6;
	color?: "primary" | "secondary";
	className?: string;
	href?: string;
}

export default function Typography({
	children,
	heading: headingLevel,
	color = "primary",
	className,
	href
}: TypographyProps): JSX.Element {
	const isHeading = headingLevel != null;
	const isLink = href != null;
	const elementType = isHeading ? `h${headingLevel}` : "a";

	const goto = useGoto();

	const handleInteract = useCallback((e: Event) => {
		if (!isLink) return;
		if (e instanceof KeyboardEvent && e.key !== "Enter" && e.key !== " ") return;

		e.preventDefault();
		goto(href);
	}, [href]);

	return createElement(elementType, {
		href: href,
		className: [
			styles.typography,
			styles[color],
			isHeading ? styles.bold : null,
			isLink ? styles.link : null,
			className
		].filter(v => v !== null).join(" "),
		onClick: handleInteract,
		onKeyDown: handleInteract
	}, children);
}
