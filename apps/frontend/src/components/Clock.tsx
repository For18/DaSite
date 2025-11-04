import React from "react";
import { Typography } from "@mui/material";
import "./styles/Clock.css";

export default function Clock(
	{ price, duration, progress }: { price: string, duration: string, progress: number }
) {
	const classNameAppend = progress < 25 ? "three-quarter" : (progress < 50 ? "halfway" : "");

	return (
		<div className={"container"}>
			<div className={`clock ${classNameAppend}`}>
				{price}
			</div>
			<Typography className={"typography"}>
        {duration}
			</Typography>
		</div>
	);
}
