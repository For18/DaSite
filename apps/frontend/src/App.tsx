import Layout from "@component/Layout";
import Throbber from "@component/Throbber";
import NotFound from "@route/NotFound";
import { createElement, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import routes from "@route/Routes";
import { AuthProvider } from "@/AuthProvider";
import { DarkTheme } from "@/themes/Dark";
import ThemeCSSProvider from "@/themes/ThemeCSSProvider";

export default function App() {
	return (
		<ThemeCSSProvider theme={DarkTheme}>
			<AuthProvider>
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
			</AuthProvider>
		</ThemeCSSProvider>
	);
}
