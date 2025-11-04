import React from "react";
import { Typography } from "@mui/material";
import "./styles/Clock.css";

export default function Clock(
	{ price, duration, progress }: { price: string, duration: string, progress: number }
) {
  const currencyType = "100 cent";

	return (
		<div className={"container"}>
			<div className={"clock"} style={{ "--progress": progress } as React.CSSProperties}>
        <div className={"clock-overlay"}>

          {/* Top Box*/}
          <div className={"clock-box currency"}> 
            <Typography> currency </Typography>
            <Typography> {currencyType} </Typography>
          </div>
  
          {/* Middle Box*/}
          <div className={"clock-box price"}> 
            <Typography> price </Typography>
            <Typography> {price} </Typography>
          </div>
  
          {/* Bottom Box*/}
          <div className={"clock-box count"}> 
            <Typography> count </Typography>
            <Typography> {6969} </Typography>
          </div>

        </div>
			</div>

			<Typography className={"typography"}>
        {duration}
			</Typography>
		</div>
	);
}
