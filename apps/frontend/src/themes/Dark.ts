import { FontType, type Theme } from "./Themes";

export const DarkTheme: Theme = {
	id: "dark",
	name: "Dark",

	colors: {
		background: {
			primary: "#181818",
			secondary: "#222222",
			tertiary: "#3a3a3a",
		},

		text: {
			primary: "#FFFFFF",
			secondary: "#B3B3B3",
		},

		status: {
			success: "#4CAF50",
			warning: "#FF9800",
			error: "#F44336",
		},

		brand: "#BB86FC",
		border: "#3f3f3fff"
	},

	shape: {
		radius: 4,
		spacing: 20
	},

	typography: {
		fonts: ['Roboto', 'Helvetica', 'Arial'],
		fontType: FontType.Serif,
		fontSize: 16,

		fontWeight: 300
	}
}