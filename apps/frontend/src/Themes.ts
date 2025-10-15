import { grey } from "@mui/material/colors";
import { createTheme, Theme } from "@mui/material/styles";

declare module "@mui/material/styles" {
	interface Theme {
		id: string;
		name: string;
	}

	interface ThemeOptions {
		id: string;
		name: string;
	}
}

const baseTheme = createTheme({
	id: "base",
	name: "Base"
});

export const LIGHT: Theme = createTheme(baseTheme, {
	id: "light",
	name: "Light",
	palette: {
		mode: "light",
		background: {
			default: grey[100],
			paper: grey[100]
		},
		text: {
			primary: "#181818",
			secondary: "#4f4f4f",
			disabled: "#a1a1a1"
		}
	}
});

export const DARK: Theme = createTheme(baseTheme, {
	id: "dark",
	name: "Dark",
	palette: {
		mode: "dark",
		background: {
			default: grey[900],
			paper: grey[900]
		},
		text: {
			primary: "#f5f5f5",
			secondary: "#cacaca",
			disabled: "#555555"
		}
	}
});

const Themes = {
	LIGHT,
	DARK
};

export function getThemeById(id: string | null): Theme | null {
	if (id == null) return null;
	for (const theme of Object.values(Themes)) {
		if (theme.id === id) {
			return theme;
		}
	}
	return null;
}

export default Themes;
