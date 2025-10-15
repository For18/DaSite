import { useTheme } from "@mui/material/styles";
import { range, useTime } from "../lib/util";

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
	const theme = useTheme();

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center"
			}}
		>
			{range(dots).map(dotIndex => (
				<div
					key={dotIndex}
					style={{
						width: "5px",
						height: "5px",
						borderRadius: "50%",
						marginLeft: dotIndex === 0 ? 0 : "4px",
						backgroundColor: theme.palette.text.primary,
						transform: `translate(0, -${animation((time + dotIndex * 130) / 1_300) * 7}px)`
					}}
				/>
			))}
		</div>
	);
}
