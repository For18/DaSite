import React from "react";
import styles from "./Profile.module.scss";

export default function Profile({ user }: { user: { avatarColor: string } }) {
	return (
		<div
			className={styles["profile-image"]}
			style={{ ["--avatarColor" as any]: user.avatarColor } as React.CSSProperties}
		/>
	);
}
