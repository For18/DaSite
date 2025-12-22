import { SetState } from "@lib/util";
import { createContext, type JSX, type PropsWithChildren, useContext, useDebugValue, useState } from "react";
import type { Theme } from "./Themes";

export interface ThemeState {
	theme: Theme;
	setTheme: SetState<Theme>;
}
const ThemeStateContext = createContext<ThemeState | null>(null);
export function useTheme(): ThemeState {
	const themeState = useContext(ThemeStateContext);
	useDebugValue(themeState?.theme?.id);
	if (themeState == null) throw new Error("Hook used outside of Theme context");
	return themeState;
}

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

			fontSize: `${currentTheme.typography.fontSize}px`,
			fontFamily: currentTheme.typography.fonts.join(", ") + ", " + currentTheme.typography.fontType,

			fontWeight: currentTheme.typography.fontWeight
		} as React.CSSProperties}>
			<ThemeStateContext.Provider value={{
				theme: currentTheme,
				setTheme: setCurrentTheme
			}}>
				{children}
			</ThemeStateContext.Provider>
		</div>
	);
}
