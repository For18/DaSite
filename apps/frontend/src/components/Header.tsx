import { TypeText, useTheme } from "@mui/material/styles";
import Typography, { TypographyPropsColorOverrides } from "@mui/material/Typography";
import { OverridableStringUnion } from "@mui/types";
import { CSSProperties, PropsWithChildren, useContext } from "react";
import { DepthContext } from "./Section";

export default function Header({
	children,
	color = "textPrimary",
	level = useContext(DepthContext) + 1
}: {
	level?: number;
	color?:
		| OverridableStringUnion<
			| "primary"
			| "secondary"
			| "success"
			| "error"
			| "info"
			| "warning"
			| `text${Capitalize<keyof TypeText>}`,
			TypographyPropsColorOverrides
		>
		| (string & {});
} & PropsWithChildren) {
	const theme = useTheme();

	const rawColor: string = color.startsWith("text") ?
		theme.palette.text[color.substring(4).toLowerCase() as keyof TypeText] :
		(theme.palette as any)[color]?.main;

	const styles: CSSProperties = {
		fontSize: Math.pow(0.5, (level - 4) / 3) * theme.typography.fontSize * 1.5,
		fontWeight: theme.typography.fontWeightBold,
		fontFamily: theme.typography.fontFamily,
		color: rawColor,
		margin: 0
	};
	switch (level) {
		case 1:
			return <h1 style={styles}>{children}</h1>;
		case 2:
			return <h2 style={styles}>{children}</h2>;
		case 3:
			return <h3 style={styles}>{children}</h3>;
		case 4:
			return <h4 style={styles}>{children}</h4>;
		case 5:
			return <h5 style={styles}>{children}</h5>;
		case 6:
			return <h6 style={styles}>{children}</h6>;
		default:
			return <Typography style={styles}>{children}</Typography>;
	}
}
