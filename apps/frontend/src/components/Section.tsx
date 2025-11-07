import { PropsWithChildren } from "react";
import styles from "./Section.module.scss";

export interface FlexConfig {
	direction: "row" | "column" | "row-reverse" | "column-reverse";
	justify?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly";
	align?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
	wrap?: "nowrap" | "wrap" | "wrap-reverse";
	gap?: number;
}

export interface SectionProps extends PropsWithChildren {
	flex?: FlexConfig;
}

export default function Section({ children, flex }: SectionProps) {
	return (
		<section className={styles.section} style={{
			display: flex !== null ? "flex" : undefined,
			flexDirection: flex?.direction,
			justifyContent: flex?.justify,
			alignItems: flex?.align,
			flexWrap: flex?.wrap,
			gap: flex?.gap
		}}>
			{children}
		</section>
	);
}
