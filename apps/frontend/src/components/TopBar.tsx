import { useNavigate } from "react-router";
import ThemeSelector from "./ThemeSelector";
import Themes from "../Themes";
import { alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";

export default function TopBar({
	links,
}: {
	links: { [name: string]: string };
}) {
	const navigate = useNavigate();

	return (
		<header
			style={{
				padding: "1em",
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-evenly",
				alignItems: "center",
				backgroundColor: alpha("#888888", 0.05),
			}}
		>
			<nav>
				{Object.entries(links).map((entry) => {
					const [name, path] = entry;
					return (
						<Button
							key={name}
							onClick={(e) => {
								navigate(path);
							}}
						>
							{name}
						</Button>
					);
				})}
			</nav>
			<ThemeSelector
				style={{
					justifySelf: "end",
				}}
				themes={[Themes.LIGHT, Themes.DARK]}
			/>
		</header>
	);
}
