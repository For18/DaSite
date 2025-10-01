import App from "./App";
import ReactDom from "react-dom/client";

const rootNode = document.getElementById("root");

if (rootNode == null) throw new Error("No root node found");

ReactDom.createRoot(rootNode).render(<App />);
