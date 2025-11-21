import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootNode = document.getElementById("root");

if (rootNode == null) throw new Error("No root node found");

createRoot(rootNode).render(
	<StrictMode>
		<App/>
	</StrictMode>
);
