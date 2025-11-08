import { FontType, type Theme } from "./Themes";

export const LightTheme: Theme = {
	id: "light",
	name: "Light",

	colors: {
		background: {
			primary: "#ffffff",
			secondary: "#f2f2f2",
			tertiary: "#bbbbbb"
		},

		text: {
			primary: "#000000",
			secondary: "#8f8f8f"
		},

		status: {
			success: "#4CAF50",
			warning: "#FF9800",
			error: "#F44336"
		},

		brand: "#BB86FC",
		border: "#e6e6e6"
	},

	shape: {
		radius: 4,
		spacing: 20
	},

	typography: {
		fonts: ["Roboto", "Helvetica", "Arial"],
		fontType: FontType.Serif,
		fontSize: 16,

		fontWeight: 300
	}
};
