import { createElement, useCallback, type JSX, type PropsWithChildren } from "react";
import styles from "./Typography.module.scss";
import { useNavigate } from "react-router";

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
	const elementType = isHeading ? `h${headingLevel}` : "span";

	const navigate = useNavigate();

	return createElement(elementType, {
		className: [
			styles.typography,
			styles[color],
			isHeading ? styles.bold : null,
			isLink ? styles.link : null,
			className
		].filter(v => v !== null).join(" "),
		onClick: useCallback(() => {
			if (href != null) navigate(href);
		}, [href])
	}, children);
}
