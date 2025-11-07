import { createContext, JSX, PropsWithChildren, useState } from "react";
import { Theme } from "./Themes";

export const SetThemeContext = createContext<(theme: Theme) => void>(() => {});
export const ThemeContext = createContext<Theme | null>(null);

export default function ThemeCSSProvider({ children, theme }: {
	theme: Theme;
} & PropsWithChildren): JSX.Element {
	const [currentTheme, setCurrentTheme] = useState<Theme>(theme);

	return (
		<div style={{
			"--color-background-primary": currentTheme.colors.background.primary,
			"--color-background-secondary": currentTheme.colors.background.secondary,
			"--color-background-tertiary": currentTheme.colors.background.tertiary,

			"--color-text-primary": currentTheme.colors.text.primary,
			"--color-text-secondary": currentTheme.colors.text.secondary,

			"--color-brand": currentTheme.colors.brand,
			"--color-border": currentTheme.colors.border,

			"--color-status-success": currentTheme.colors.status.success,
			"--color-status-warning": currentTheme.colors.status.warning,
			"--color-status-error": currentTheme.colors.status.error,

			"--border-radius": `${currentTheme.shape.radius}px`,
			"--spacing": `${currentTheme.shape.spacing}px`,

			"fontSize": `${currentTheme.typography.fontSize}px`,
			"fontFamily": currentTheme.typography.fonts.join(", ") + ", " + currentTheme.typography.fontType,

			"fontWeight": currentTheme.typography.fontWeight
		} as React.CSSProperties}>
			<SetThemeContext.Provider value={setCurrentTheme}>
				<ThemeContext.Provider value={currentTheme}>
					{children}
				</ThemeContext.Provider>
			</SetThemeContext.Provider>
		</div>
	);
}
