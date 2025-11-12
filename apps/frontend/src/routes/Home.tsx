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
			<div className={styles.header}>
				<Typography heading={1} className="headerText">
					Flora Holland Veiling
				</Typography>
			</div>
			<div className={styles.main}>
				<div className={styles.left}>					
					<div className={styles.subHeader}>
						<Typography heading={2} color="secondary">
							Welkom bij de veiling site van Royal FloraHolland
						</Typography>
						<Typography>
							Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! Dit is de website van royal floraholland. We verkopen bloemen door middel van ons online veilingsysteem! 
						</Typography>
					</div>
				</div>
				<div className={styles.right}>
					<div className={styles.header4}>
						<Typography heading={4} color="secondary">
							Info
						</Typography>
						<Typography>
							Wij verbinden kwekers en kopers, elke dag opnieuw. Met passie voor bloemen, innovatie en duurzaamheid bouwen we aan de toekomst van de internationale sierteelt.
						</Typography>
					</div>
				</div>
			</div>
		</>
	);
}
