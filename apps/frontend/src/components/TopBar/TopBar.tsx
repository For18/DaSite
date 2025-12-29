import useAuth from "@/AuthProvider";
import Button from "@component/Button";
import Image from "@component/Image";
import { Routes } from "@route/Routes";
import { useNavigate } from "react-router";
import styles from "./TopBar.module.scss";
import Stack from "@component/Stack";

export default function TopBar({
	links
}: {
	links: { [name: string]: string };
}) {
	const navigate = useNavigate();
	const authState = useAuth();
	if (authState == null) throw new Error("Clockpage component rendered outside of AuthContext");
	const { user } = authState;

	return (
		<header className={styles.header}>
			<nav>
				<Stack direction="row">
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
				</Stack>
			</nav>
			<Image
				className={styles.profile}
				src={[user?.avatarImageUrl, "https://www.shutterstock.com/image-vector/highresolution-default-profile-avatar-icon-260nw-2600268263.jpg"]}
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
