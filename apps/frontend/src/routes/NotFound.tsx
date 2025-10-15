import Header from "../components/Header";

export default function NotFound() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center"
			}}
		>
			<img src="https://http.cat/404.png"/>
			<Header level={-3}>404</Header>
			<Header level={1}>Not found</Header>
		</div>
	);
}
