import { AuthProvider } from "@/AuthProvider";
import { DarkTheme } from "@/themes/Dark";
import ThemeCSSProvider from "@/themes/ThemeCSSProvider";
import Layout from "@component/Layout";
import Throbber from "@component/Throbber";
import Error from "@route/Error";
import NotFound from "@route/NotFound";
import routes from "@route/Routes";
import { createElement, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Route, Routes } from "react-router";

export default function App() {
	return (
		<ThemeCSSProvider theme={DarkTheme}>
			<ErrorBoundary fallback={<Error/>} onReset={() => location.reload()}>
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
			</ErrorBoundary>
		</ThemeCSSProvider>
	);
}
