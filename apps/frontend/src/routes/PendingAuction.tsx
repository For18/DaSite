import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Auction, useAPI } from "../lib/api";
import { randomCharacter } from "../lib/util";

export default function PendingAuction() {
	const auctions = useAPI<Auction[]>("/auctions/pending");
	const items = [];
	for(let i = 0; i < 6; i++){
		items.push(
			<div grid-area={"item"+1}>
				<Typography>
					Pending Auction {i+1}
				</Typography>
			</div>
		);
	}

	return (
		<Paper sx={{
			width: "800px",
			maxWidth: "80%",
			minHeight: "300px",
			display: "grid",
			gridTemplateColumns: "auto auto",
			gap: "16px",
			padding: "16px"

		}}>
			
			{items}
			<div grid-area="menu" color="red">
				<Typography color="textPrimary">
					Pending Auctions (under construction)
				</Typography>
			</div>
			<div grid-area="content" color="blue">
				<Typography color="textPrimary">
					Ik wil kaas
				</Typography>
			</div>
			<div grid-area="shit" color="green">
				<Typography color="textPrimary">
					En nog meer kaas
				</Typography>
			</div>
		</Paper>
		
	);
}
