import { useNavigate } from "react-router";
import useAuth from "../AuthProvider";
import { Routes } from "../routes/Routes";
import Button from "./Button";
import Image from "./Image";
import styles from "./TopBar.module.scss";

export default function TopBar({
	links
}: {
	links: { [name: string]: string };
}) {
	const navigate = useNavigate();
	const authState = useAuth();
	if (authState == null) throw new Error("Clockpage component rendered outside of AuthContext");
	const { user } = authState;

	// TODO: find better placeholder (built in <Image> placeholder doesn't work)
	const pfpUrl = user?.avatarImageUrl ??
		"https://www.shutterstock.com/image-vector/highresolution-default-profile-avatar-icon-260nw-2600268263.jpg";

	return (
		<header className={styles.header}>
			<nav>
				{Object.entries(links).map(([name, path]) => (
					<Button
						key={name}
						onClick={_ => {
							navigate(path);
						}}
					>
						{name}
					</Button>
				))}
			</nav>
			<Image
				className={styles.profile}
				src={pfpUrl}
				alt={"User Profile"}
				width={50}
				height={50}
				onClick={() => {
					if (user) {
						navigate(Routes.Pages.Profile(user.id));
					} else {
						navigate(Routes.Pages.Login);
					}
				}}
			/>
		</header>
	);
}
