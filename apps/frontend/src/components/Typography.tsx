import { createElement, type JSX, type PropsWithChildren } from "react";
import styles from "./Typography.module.scss";

export interface TypographyProps extends PropsWithChildren {
	heading?: 1 | 2 | 3 | 4 | 5 | 6;
	color?: "primary" | "secondary";
	bold?: boolean;
	italic?: boolean;
	underlined?: boolean;
	align?: "left" | "center" | "right" | "justify";
}

export default function Typography({
	children,
	heading: headingLevel,
	color = "primary",
	bold = false,
	italic = false,
	underlined = false,
	align = "left"
}: TypographyProps): JSX.Element {
	const isHeading = headingLevel != null;
	const elementType = isHeading ? `h${headingLevel}` : "p";
	if (isHeading) bold = true;

	return createElement(elementType, {
		className: [
			styles.typography,
			styles[color],
			bold && styles.bold,
			italic && styles.italic,
			underlined && styles.underlined
		].filter(v => v !== null).join(" "),
		style: {
			textAlign: align
		}
	}, children);
}
