import { useNavigate } from "react-router";
import Button from "./Button";
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
		</header>
	);
}
