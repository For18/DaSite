import { Link } from "react-router";
import Footer from "./components/Footer";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<>
			<nav>
				<Link to="/">Home</Link>
			</nav>
			<article>
				{children}
			</article>
			<Footer/>
		</>
	)
}