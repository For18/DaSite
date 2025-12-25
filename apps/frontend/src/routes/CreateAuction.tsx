import Button from "@component/Button";
import ProductView from "@component/ProductView";
import { type Status, StatusDisplay } from "@component/StatusDisplay";
import Typography from "@component/Typography";
import { API_URL, AuctionItem, useAPI } from "@lib/api";
import { Routes } from "@route/Routes";
import { useRef, useState } from "react";
import styles from "./CreateAuction.module.scss";
import Checkbox from "@/components/Checkbox";

const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

function getDefaultDate() {
	const now = new Date();
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function getDefaultTime() {
	const now = new Date();
	return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export default function CreateAuctions() {
	const [productsSelected, setProductsSelected] = useState<string[]>([]);
	const startingDateRef = useRef<string>(getDefaultDate());
	const startingTimeRef = useRef<string>(getDefaultTime());

	const auctionItems = useAPI<AuctionItem[]>(Routes.AuctionItem.GetAll);
	const [status, setStatus] = useState<Status>({ type: "none", label: "" });

	async function submitAuction() {
		const itemIds = productsSelected.map(Number).filter(id => !Number.isNaN(id));
		if (itemIds.length === 0) {
			setStatus({
				type: "error",
				label: "Please select at least one auction item."
			});
			return;
		}

		// combine startingDate and startingTime into an ISO datetime
		let startingTimeMillis: number | null = null;
		if (startingDateRef.current && startingTimeRef.current) {
			const iso = `${startingDateRef.current}T${startingTimeRef.current}:00`;
			const parsed = Date.parse(iso);
			startingTimeMillis = Number.isNaN(parsed) ? null : Math.round(parsed);
		}

		const payload = {
			startingTime: startingTimeMillis, // milliseconds since epoch or null
			// send selected auction-item ids in the legacy productIds field
			productIds: itemIds,
			plannerId: null
		} as any;

		try {
			setStatus({
				type: "progress",
				label: "Creating auction..."
			});
			const resp = await fetch(API_URL + Routes.Auction.Post, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});

			if (!resp.ok) {
				const text = await resp.text();
				setStatus({
					type: "error",
					label: `Failed to create auction: ${resp.status} ${text}`
				});
				return;
			}

			const data = await resp.json();
			const createdId = data?.id ?? data?.Id ?? null;
			setStatus({
				type: "success",
				label: `Created auction id=${createdId ?? "(unknown)"}`
			});

			// create auction-entry records linking this auction to selected auction-items
			if (createdId) {
				const auctionId = Number(createdId);
				setStatus({
					type: "progress",
					label: "Creating auction entries..."
				});
				try {
					const promises = itemIds.map(async itemId => {
						const r = await fetch(API_URL + Routes.AuctionEntry.Post, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ auctionId: auctionId, itemId: Number(itemId) })
						});
						if (!r.ok) {
							const text = await r.text();
							throw new Error(`Failed to create auction entry for item ${itemId}: ${r.status} ${text}`);
						}
					});
					await Promise.all(promises);
					setStatus({
						type: "success",
						label: "Created auction entries."
					});
				} catch (err) {
					setStatus({
						type: "error",
						label: String(err)
					});
				}
			}
		} catch (err) {
			setStatus({
				type: "error",
				label: String(err)
			});
		}
	}

	return (
		<>
			<div className={styles.container}>
				<Typography heading={1}>Create Auction</Typography>

				<Typography heading={3}>Available Auction Items:</Typography>

				{Array.isArray(auctionItems) ?
					(
						auctionItems.length ?
							(
								<div className={styles.productList}>
									{auctionItems.map(item => (
										<label
											key={item.id}
											className={styles.product +
												(productsSelected.includes(String(item.id)) ?
													` ${styles.selected}` :
													"")}
										>
											<Checkbox checked={productsSelected.includes(String(item.id))} onClick={() => {
												const val = String(item.id);
													setProductsSelected(prev =>
														prev.includes(val) ?
															prev.filter(x => x !== val) :
															[...prev, val]
													);
											}}/>
											<ProductView auctionItem={item}/>
										</label>
									))}
								</div>
							) :
							<Typography>No auction items available</Typography>
					) :
					null}

				<label htmlFor="startingDate" className={styles.inputLabel}>Starting date</label>
				<input
					id="startingDate"
					className={styles.input}
					name="startingDate"
					type="date"
					defaultValue={startingDateRef.current}
					onChange={e => (startingDateRef.current = e.target.value)}
				/>
				<label htmlFor="startingTime" className={styles.inputLabel}>Starting time</label>
				<input
					id="startingTime"
					className={styles.input}
					name="startingTime"
					type="time"
					defaultValue={startingTimeRef.current}
					onChange={e => (startingTimeRef.current = e.target.value)}
				/>

				<Button variant="contained" color="brand" onClick={submitAuction}>Create Auction</Button>
				<Typography heading={2}>
					Selected Auction Item ID:
				</Typography>
				<Typography heading={3}>
					{productsSelected.length ? productsSelected.join(", ") : "(none selected)"}
				</Typography>
				<StatusDisplay status={status}/>
			</div>
		</>
	);
}
