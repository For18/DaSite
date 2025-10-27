import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Auction, useAPI } from "../lib/api";
import { randomCharacter, range, useScreenSize } from "../lib/util";

export default function PendingAuction() {
	const auctions = useAPI<Auction[]>("/auctions/pending");
	const [x, y] = useScreenSize();

	return (
		<Paper sx={{
			width: "800px",
			maxWidth: "80%",
			minHeight: "300px",
			display: "grid",
			gridTemplateColumns: x > 1000 ? "auto auto" : "auto",
			gap: "16px",
			padding: "16px"

		}}>
			
			{range(6).map(i => <div style={{
				backgroundColor: "red",
				width: "100%",
				aspectRatio: "4/1"
			}}/>)}
		</Paper>
		
	);
}
