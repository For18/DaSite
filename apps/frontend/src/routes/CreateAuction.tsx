import { useRef, useState } from "react";
import Button from "../components/Button";
import ProductView from "../components/ProductView";
import { type Status, StatusDisplay } from "../components/StatusDisplay";
import Typography from "../components/Typography";
import { API_URL, AuctionItem, useAPI } from "../lib/api";
import styles from "./CreateAuction.module.scss";

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
	const [count, setCount] = useState(1);
	const [batchSize, setBatchSize] = useState(1);
	const [startingPrice, setStartingPrice] = useState(0);
	const [minimumPrice, setMinimumPrice] = useState(0);
	const [durationSeconds, setDurationSeconds] = useState(120);
	const startingDateRef = useRef<string>(getDefaultDate());
	const startingTimeRef = useRef<string>(getDefaultTime());

	const auctionItems = useAPI<AuctionItem[]>("/auction-item/all");
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
			count: Number(count),
			batchSize: Number(batchSize),
			startingPrice: Number(startingPrice),
			minimumPrice: Number(minimumPrice),
			startingTime: startingTimeMillis, // milliseconds since epoch or null
			length: Number(durationSeconds),
			// send selected auction-item ids in the legacy productIds field
			productIds: itemIds,
			plannerId: null
		} as any;

		try {
			setStatus({
				type: "progress",
				label: "Creating auction..."
			});
			const resp = await fetch(API_URL + "/auction", {
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
						const r = await fetch(API_URL + "/auction-entry", {
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
											<input
												className={styles.checkbox}
												type="checkbox"
												name="auctionItemId"
												value={String(item.id)}
												checked={productsSelected.includes(String(item.id))}
												onChange={e => {
													const val = e.target.value;
													setProductsSelected(prev =>
														prev.includes(val) ?
															prev.filter(x => x !== val) :
															[...prev, val]
													);
												}}
											/>
											<ProductView auctionItem={item}/>
										</label>
									))}
								</div>
							) :
							<Typography>No auction items available</Typography>
					) :
					null}

				<Typography heading={3}>Starting date:</Typography>
				<input
					className={styles.input}
					name="startingDate"
					type="date"
					defaultValue={startingDateRef.current}
					onChange={e => (startingDateRef.current = e.target.value)}
				/>
				<Typography heading={3}>Starting time:</Typography>
				<input
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
