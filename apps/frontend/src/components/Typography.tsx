import { createElement, type JSX, type PropsWithChildren } from "react";
import styles from "./Typography.module.scss";

export interface TypographyProps extends PropsWithChildren {
	heading?: 1 | 2 | 3 | 4 | 5 | 6;
	color?: "primary" | "secondary";
	className?: string;
}

export default function Typography({
	children,
	heading: headingLevel,
	color = "primary",
	className
}: TypographyProps): JSX.Element {
	const isHeading = headingLevel != null;
	const elementType = isHeading ? `h${headingLevel}` : "span";

	return createElement(elementType, {
		className: [
			styles.typography,
			styles[color],
			isHeading ? styles.bold : null,
			className
		].filter(v => v !== null).join(" ")
	}, children);
}
