import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router";
import Themes from "../Themes";
import ThemeSelector from "./ThemeSelector";
import styles from "./TopBar.module.scss";

export default function TopBar({
	links
}: {
	links: { [name: string]: string };
}) {
	const navigate = useNavigate();

	return (
		<header className={styles.header}>
			<nav>
				{Object.entries(links).map(([name, path]) => (
					<Button
						key={name}
						onClick={e => {
							navigate(path);
						}}
					>
						{name}
					</Button>
				))}
			</nav>
			<ThemeSelector themes={Object.values(Themes)}/>
		</header>
	);
}
