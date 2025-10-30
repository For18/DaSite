import { Theme, ThemeProvider } from "@mui/material/styles";
import React, { createContext, lazy, Suspense, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Throbber from "./components/Throbber";
import NotFound from "./routes/NotFound";
import Themes, { getThemeById } from "./Themes";

import routes from "./routes/Routes";

export const SetThemeContext = createContext<(theme: Theme) => void>(() => {});

export default function App() {
	const [theme, setThemeState] = useState<Theme>(
		getThemeById(window.localStorage.getItem("theme")) ?? Themes.LIGHT
	);

	function setTheme(theme: Theme) {
		setThemeState(theme);
		window.localStorage.setItem("theme", theme.id);
	}

	return (
		<ThemeProvider theme={theme}>
			<SetThemeContext.Provider value={setTheme}>
				<BrowserRouter>
					<Layout>
						<Routes>
							{Object.entries(routes).map(([path, component]) => <Route key={path} path={path} element={
								<Suspense fallback={<Throbber/>}>
									{React.createElement(component)}
								</Suspense>
							}/>)}

							<Route path="*" element={<NotFound/>}/>
						</Routes>
					</Layout>
				</BrowserRouter>
			</SetThemeContext.Provider>
		</ThemeProvider>
	);
}
