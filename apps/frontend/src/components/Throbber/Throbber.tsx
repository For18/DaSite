import { range } from "@lib/util";
import useTime from "@/lib/hooks/useTime";
import styles from "./Throbber.module.scss";

function animation(t: number): number {
	t = t % 1;

	const ratio = 4;

	if (t <= (ratio - 1) / ratio) {
		return 0;
	} else {
		const progress = (t - (ratio - 1) / ratio) * ratio;
		return Math.sin(progress * Math.PI);
	}
}

export default function Throbber({ dots = 4 }: { dots?: number }) {
	const time = useTime();

	return (
		<div className={styles.container}>
			{range(dots).map(dotIndex => (
				<div
					key={dotIndex}
					className={styles.dot}
					style={{
						transform: `translate(0, -${animation((time + dotIndex * 130) / 1_300) * 7}px)`
					}}
				/>
			))}
		</div>
	);
}
