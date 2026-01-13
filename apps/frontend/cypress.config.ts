import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:5173",
		setupNodeEvents(on, config) {
			// on("dev-server:start", (options) => { // TODO: Fix
			// 	// docker build -t for18-frontend . & docker run -e VITE_API_URL="/api/v1" -p 5173:5173 for18-frontend
			// })
			on("file:preprocessor", vitePreprocessor());
		}
	},

	component: {
		devServer: {
			framework: "react",
			bundler: "vite"
		}
	}
});
