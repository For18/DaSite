import { useNavigate } from "react-router";
import { PublicUser, API_URL } from "../lib/api";
import { usePromise } from "../lib/util";
import Button from "./Button";
import styles from "./TopBar.module.scss";
import Image from "./Image";
import { Routes } from "../routes/Routes";

export default function TopBar({
	links
}: {
	links: { [name: string]: string };
}) {
	const navigate = useNavigate();
  const currentUserPromise = usePromise<PublicUser>(async () => {
      return fetch(API_URL + Routes.User.GetCurrent)
        .then(response => {
            if (response.status == 401) throw new Error("No logged user");
            else if (response.status != 200) throw new Error("Error: " + response.status)

            return response.json();
        })
        .then(data => data as PublicUser)
        .then(user => user);
  }, []);

  // TODO: find better placeholder (build in <Image> placeholder doesn't work)
  let pfpUrl = "https://www.shutterstock.com/image-vector/highresolution-default-profile-avatar-icon-260nw-2600268263.jpg";
  if (currentUserPromise.error) { console.error(currentUserPromise.error) }
  else if(currentUserPromise.value != null && currentUserPromise.value.avatarImageUrl != null) {
    pfpUrl = currentUserPromise.value.avatarImageUrl
  }

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
          if (currentUserPromise.value){
            navigate(Routes.Pages.Profile(currentUserPromise.value.id));
          } else {
            navigate(Routes.Pages.Login);
          }
        }}
      />
		</header>
	);
}
