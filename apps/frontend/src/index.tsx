import { StrictMode } from "react";
import ReactDom from "react-dom/client";
import App from "./App";

const rootNode = document.getElementById("root");

if (rootNode == null) throw new Error("No root node found");

ReactDom.createRoot(rootNode).render(
	<StrictMode>
		<App/>
	</StrictMode>
);
