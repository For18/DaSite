import Home from "./routes/Home";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./Layout";
import { Theme, ThemeProvider } from "@mui/material/styles";
import Themes from "./themes";
import { useState } from "react";

export default function App() {
	const [theme, setTheme] = useState<Theme>(Themes.LIGHT);

	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route index element={<Home />} />
					</Routes>
				</Layout>
			</BrowserRouter>
		</ThemeProvider>
	);
}
