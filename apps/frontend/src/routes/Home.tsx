import { useCallback, useEffect, useState } from "react";
import Image from "../components/Image";
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
			<div className={styles.heading}>
				<Typography heading={1}>
					FloraHolland Veilingwebsite
				</Typography>
			</div>

			<div className={styles.main}>
				<div className={styles.imageBackground}>
					<div className={styles.left}>
						<div className={styles.subHeading}>
							<Typography heading={2}>
								Welkom bij de veiling site van Royal FloraHolland
							</Typography>
							<div>
								<Typography>
									Bloemen en planten maken onze wereld groener. Ze kleuren onze huizen, tuinen en
									buurten en vergroenen onze steden. Een groene omgeving maakt mensen gelukkig en het
									werkt stressverlagend. <br/>
									<br/>
									Onze coöperatie is een twee-eenheid: we zijn een vereniging én een bedrijf. <br/>
									<br/>
									We hebben twee doelen: een gezonde en aantrekkelijke coöperatie voor onze leden zijn
									en blijven én bouwen aan het grootste internationale B2B platform binnen de
									sierteeltsector. <br/>
									<br/>
									Duurzaamheid is hierbij een belangrijk fundament. Door bundeling van kennis en
									kracht bereiken we duurzaam succes, internationale groei en versterken we de
									coöperatie. Om voorop te blijven lopen, nu en in de toekomst.
								</Typography>
							</div>
						</div>
					</div>
					<div className={styles.right}>
						<div className={styles.heading4}>
							<Typography heading={4} color="secondary">
								Info
							</Typography>
							<Typography>
								Wij verbinden kwekers en kopers, elke dag opnieuw. Met passie voor bloemen, innovatie en
								duurzaamheid bouwen we aan de toekomst van de internationale sierteelt.
							</Typography>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
