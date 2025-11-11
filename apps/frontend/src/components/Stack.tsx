import { JSX, PropsWithChildren } from "react";

export interface StackProps extends PropsWithChildren {
	direction: "row" | "column" | "row-reverse" | "column-reverse";
	gap?: number;
}

export default function Stack({ direction, gap = 0, children }: StackProps): JSX.Element {
	return (
		<div style={{
			display: "flex",
			flexDirection: direction,
			gap: gap,
			width: "fit-content",
			height: "fit-content"
		}}>
			{children}
		</div>
	);
}
