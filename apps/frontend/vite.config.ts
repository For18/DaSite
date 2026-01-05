import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react({}), {
		name: "dev-elements",
		transformIndexHtml(html: string, ctx) {
			if (ctx?.server == null) { // Production
				return html.replace(/<\s*vite-dev\s*>([\s\S]*?)<\s*\/\s*vite-dev\s*>/g, "");
			} else { // Development
				return html.replace(/<\s*vite-dev\s*>([\s\S]*?)<\s*\/\s*vite-dev\s*>/g, "$1");
			}
		}
	}],
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
			"@": "/src",
			"@component": "/src/components",
			"@route": "/src/routes",
			"@lib": "/src/lib"
		}
	}
});
