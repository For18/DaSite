import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react({})],
	css: {
		modules: {
			localsConvention: "camelCase"
		},
		postcss: {
			plugins: [
				autoprefixer({})
			]
		}
	},
	resolve: {
		alias: {
			"@component": "/src/components",
			"@route": "/src/routes",
			"@lib": "/src/lib"
		}
	}
});
