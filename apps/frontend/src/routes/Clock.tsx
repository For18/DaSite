import { alpha } from "@mui/material/styles";

export default function Clock() {
	return (
		<div
			style={{
				width: "100vw",
				height: "100%",
				display: "flex",
				flexDirection: "row",
			}}
		>
			<div
				style={{
					width: "50%",
					height: "100%",
					borderRight: "1px solid",
					borderColor: alpha("#888888", 0.1),
				}}
			></div>
			<div
				style={{
					width: "50%",
					height: "100%",
					borderLeft: "1px solid",
					borderColor: alpha("#888888", 0.1),
				}}
			></div>
		</div>
	);
}
