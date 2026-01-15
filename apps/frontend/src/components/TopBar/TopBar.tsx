import useAuth from "@/AuthProvider";
import Button from "@component/Button";
import ClickAwayDetector from "@component/ClickAwayDetector";
import Image from "@component/Image";
import Stack from "@component/Stack";
import Typography from "@component/Typography";
import useGoto from "@lib/hooks/useGoto";
import { Routes } from "@route/Routes";
import { useState } from "react";
import styles from "./TopBar.module.scss";

export default function TopBar({
	links
}: {
	links: { [name: string]: string };
}) {
	const goto = useGoto();
	const authState = useAuth();
	const { user, logout } = authState;
	const [open, setOpen] = useState(false);

	const handleLogout = async () => {
		logout();
		setOpen(false);
		goto(Routes.Pages.Home);
	};

	return (
		<header className={styles.header}>
			<nav>
				<Stack direction="row">
					{Object.entries(links).map(([name, path]) => (
						<Button
							key={name}
							onClick={_ => {
								goto(path);
							}}
						>
							{name}
						</Button>
					))}
				</Stack>
			</nav>
			<div className={styles.profileWrapper}>
				<ClickAwayDetector onClickAway={() => setOpen(false)}>
					<Image
						className={styles.profile}
						src={[user?.avatarImageUrl,
							"https://www.shutterstock.com/image-vector/highresolution-default-profile-avatar-icon-260nw-2600268263.jpg"]}
						alt="User Profile"
						width={50}
						height={50}
						onClick={() => {
							if (user) setOpen(o => !o);
							else goto(Routes.Pages.Login);
						}}
					/>

					{open && (
						<div className={styles.selectionCard}>
							<Typography
								className={styles.menuItem}
								onClick={() => goto(Routes.Pages.Profile(user.id))}
							>
								Profile
							</Typography>

							<Typography
								className={styles.menuItem}
								onClick={async () => {
									await handleLogout();
									goto(Routes.Pages.Home);
								}}
							>
								Logout
							</Typography>
						</div>
					)}
				</ClickAwayDetector>
			</div>
		</header>
	);
}
