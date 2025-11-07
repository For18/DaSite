export enum FontType {
	Serif = "serif",
	SansSerif = "sans-serif",
	Monospace = "monospace"
}

export interface Theme {
	id: string;
	name: string;

	colors: {
		background: {
			primary: string;
			secondary: string;
			tertiary: string;
		};

		text: {
			primary: string;
			secondary: string;
		};

		status: {
			success: string;
			warning: string;
			error: string;
		};

		brand: string;
		border: string;
	};

	shape: {
		radius: number;
		spacing: number;
	};

	typography: {
		fonts: string[];
		fontType: FontType;
		fontSize: number;
		fontWeight: number;
	};
}
