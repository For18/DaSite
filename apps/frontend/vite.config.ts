import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { optimizeCssModules } from "vite-plugin-optimize-css-modules";
import { defineConfig } from "vite";

function htmlDevElements() {
	return {
		name: "html-dev-elements",
		transformIndexHtml(html: string, ctx) {
			if (ctx?.server == null) { // Production
				return html.replace(/<\s*vite-dev\s*>([\s\S]*?)<\s*\/\s*vite-dev\s*>/g, "");
			} else { // Development
				return html.replace(/<\s*vite-dev\s*>([\s\S]*?)<\s*\/\s*vite-dev\s*>/g, "$1");
			}
		}
	}
}

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: ["babel-plugin-react-compiler"]
			}
		}),
		optimizeCssModules(), // Minify css module class names (in prod)
		htmlDevElements()
	],
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
