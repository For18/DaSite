import useGoto from "@lib/hooks/useGoto";
import { createElement, type JSX, type PropsWithChildren, useCallback } from "react";
import styles from "./Typography.module.scss";

export interface TypographyProps extends PropsWithChildren {
	heading?: 1 | 2 | 3 | 4 | 5 | 6;
	color?: "primary" | "secondary";
	className?: string;
	href?: string;
	id?: string;
  onClick: () => void;
}

export default function Typography({
	children,
	heading: headingLevel,
	color = "primary",
	className,
	href,
	id,
  onClick
}: TypographyProps): JSX.Element {
	const isHeading = headingLevel != null;
	const isLink = href != null;
	const elementType = isHeading ? `h${headingLevel}` : isLink ? "a" : "span";

	const goto = useGoto();

	const click = useCallback((e: Event) => {
		if (href == null) return;
		e.preventDefault();
		goto(href);
	}, [href]);
	const keydown = useCallback((e: KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") click(e);
	}, [click]);

	return createElement(elementType, {
		id: id,
		href: href,
		role: isLink ? "link" : undefined,
		tabIndex: isLink ? 0 : undefined,
		className: [
			styles.typography,
			styles[color],
			isHeading ? styles.bold : null,
			isLink ? styles.link : null,
			className
		].filter(v => v !== null).join(" "),
    onClick: e => {
      click(e);
      onClick();
    },
		onKeyDown: isLink ? keydown : undefined
	}, children);
}
