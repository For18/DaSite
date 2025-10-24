import { Theme, ThemeProvider } from "@mui/material/styles";
import { createContext, lazy, Suspense, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Throbber from "./components/Throbber";
import NotFound from "./routes/NotFound";
import Themes, { getThemeById } from "./Themes";
const Home = lazy(() => import("./routes/Home"));
const Clock = lazy(() => import("./routes/Clock"));
const Auctions = lazy(() => import("./routes/Auctions"));

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
							<Route
								index
								element={
									<Suspense fallback={<Throbber/>}>
										<Home/>
									</Suspense>
								}
							/>
							<Route
								path="/clock/:auctionId"
								element={
									<Suspense fallback={<Throbber/>}>
										<Clock/>
									</Suspense>
								}
							/>
							<Route
								path="/Auctions"
								element={
									<Suspense fallback={<Throbber/>}>
										<Auctions/>
									</Suspense>
								}
							/>

							<Route path="*" element={<NotFound/>}/>
						</Routes>
					</Layout>
				</BrowserRouter>
			</SetThemeContext.Provider>
		</ThemeProvider>
	);
}
