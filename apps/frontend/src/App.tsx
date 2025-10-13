import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import { Theme, ThemeProvider } from "@mui/material/styles";
import Themes, { getThemeById } from "./Themes";
import { createContext, lazy, Suspense, useState } from "react";
import Throbber from "./components/Throbber";
import NotFound from "./routes/NotFound";
const Home = lazy(() => import("./routes/Home"));
const Clock = lazy(() => import("./routes/Clock"));
const Auction = lazy(() => import("./routes/Auction"));

export const SetThemeContext = createContext<(theme: Theme) => void>(() => {});

export default function App() {
	const [theme, setThemeState] = useState<Theme>(
		getThemeById(window.localStorage.getItem("theme")) ?? Themes.LIGHT,
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
							<Route
								index
								element={
									<Suspense fallback={<Throbber />}>
										<Home />
									</Suspense>
								}
							/>
							<Route
								path="/clock"
								element={
									<Suspense fallback={<Throbber />}>
										<Clock />
									</Suspense>
								}
							/>
							<Route
								path="/auction"
								element={
									<Suspense fallback={<Throbber />}>
										<Auction />
									</Suspense>
								}
							/>

							<Route path="*" element={<NotFound />} />
						</Routes>
					</Layout>
				</BrowserRouter>
			</SetThemeContext.Provider>
		</ThemeProvider>
	);
}
