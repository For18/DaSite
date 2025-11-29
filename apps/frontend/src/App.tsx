import { createElement, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Throbber from "./components/Throbber";
import NotFound from "./routes/NotFound";

import routes from "./routes/Routes";
import { DarkTheme } from "./themes/Dark";
import ThemeCSSProvider from "./themes/ThemeCSSProvider";

export default function App() {
	return (
		<ThemeCSSProvider theme={DarkTheme}>
			<BrowserRouter>
				<Layout>
					<Routes>
						{Object.entries(routes).map(([path, component]) => (
							<Route key={path} path={path} element={
								<Suspense fallback={<Throbber/>}>
									{createElement(component)}
								</Suspense>
							}/>
						))}

						<Route path="*" element={<NotFound/>}/>
					</Routes>
				</Layout>
			</BrowserRouter>
		</ThemeCSSProvider>
	);
}
