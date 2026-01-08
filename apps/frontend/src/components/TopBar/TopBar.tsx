import useAuth from "@/AuthProvider";
import Button from "@component/Button";
import Image from "@component/Image";
import { Routes } from "@route/Routes";
import { useState } from "react";
import { useNavigate } from "react-router";
import ClickAwayDetector from "../ClickAwayDetector";
import Typography from "../Typography";
import styles from "./TopBar.module.scss";

export default function TopBar({
	links
}: {
	links: { [name: string]: string };
}) {
	const navigate = useNavigate();
	const authState = useAuth();
	const { user, logout } = authState;
	const [open, setOpen] = useState(false);

	// TODO: find better placeholder (built in <Image> placeholder doesn't work)
	const pfpUrl = user?.avatarImageUrl ??
		"https://www.shutterstock.com/image-vector/highresolution-default-profile-avatar-icon-260nw-2600268263.jpg";

	const handleLogout = async () => {
		logout();
		setOpen(false);
		navigate(Routes.Pages.Home);
	};

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
			<div className={styles.profileWrapper}>
				<ClickAwayDetector onClickAway={() => setOpen(false)}>
					<>
						<Image
							className={styles.profile}
							src={pfpUrl}
							alt="User Profile"
							width={50}
							height={50}
							onClick={() => {
								if (user) setOpen(o => !o);
								else navigate(Routes.Pages.Login);
							}}
						/>

						{open && (
							<div className={styles.selectionCard}>
								<Typography
									className={styles.menuItem}
									onClick={() => navigate(Routes.Pages.Profile(user.id))}
								>
									Profile
								</Typography>

								<Typography
									className={styles.menuItem}
									onClick={async () => {
										await handleLogout();
										navigate(Routes.Pages.Home);
									}}
								>
									Logout
								</Typography>
							</div>
						)}
					</>
				</ClickAwayDetector>
			</div>
		</header>
	);
}
