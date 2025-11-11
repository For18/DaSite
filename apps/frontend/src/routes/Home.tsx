import { useCallback, useEffect, useState } from "react";
import Button from "../components/Button";
import Typography from "../components/Typography";
import { randomCharacter } from "../lib/util";
import { useScreenSize } from "../lib/util";
import styles from "./Home.module.scss";

export default function Home() {
	const [text, setText] = useState("Hello world");

	const [screenWidth, screenHeight] = useScreenSize();

	useEffect(() => {
		document.title = "For18 - Home";
	});

	const updateText = useCallback(() => {
		setText(text + randomCharacter());
	}, [text]);

	return (
		<>
			<div className={styles.main}>
				<div className={styles.left}>
					<div className={styles.header}>
						<Typography heading={1} color="primary" >
							Flora Holland Veiling
						</Typography>
					</div>
					
					<div className={styles.subHeader}>
						<Typography heading={2} color="secondary">
							Welkom bij de (online) veiling site van Flora Holland
						</Typography>
					</div>

					<div className={styles.subTextDiv}>
						<Typography color="primary">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
						</Typography>
					</div>
				</div>
				<div className={styles.right}>
					<div className={styles.header4}>
						<Typography heading={4} color="secondary">
							(Header 4) Info
						</Typography>
					</div>

					<div className={styles.header4Text}>
						<Typography color="primary">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
						</Typography>
					</div>
				</div>
			</div>
		</>
	);
}
