import type { PropsWithChildren } from "react";
import styles from "./Section.module.scss";

export interface FlexConfig {
	direction: "row" | "column" | "row-reverse" | "column-reverse";
	justify?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly";
	align?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
	wrap?: "nowrap" | "wrap" | "wrap-reverse";
}

export interface SectionProps extends PropsWithChildren {
	flex?: FlexConfig;
	className?: string;
}

export default function Section({ children, flex, className }: SectionProps) {
	return (
		<section className={styles.section + (className == null || className === "" ? "" : " " + className)} style={{
			display: flex !== null ? "flex" : undefined,
			flexDirection: flex?.direction,
			justifyContent: flex?.justify,
			alignItems: flex?.align,
			flexWrap: flex?.wrap
		}}>
			{children}
		</section>
	);
}
