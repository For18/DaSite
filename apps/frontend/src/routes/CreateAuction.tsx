import Checkbox from "@/components/Checkbox";
import Image from "@/components/Image";
import Input from "@/components/Input";
import Section from "@/components/Section";
import usePromise from "@/lib/hooks/usePromise";
import Button from "@component/Button";
import ProductView from "@component/ProductView";
import { type Status, StatusDisplay } from "@component/StatusDisplay";
import Typography from "@component/Typography";
import { API_URL, AuctionItem, Product, ProductImage, useAPI } from "@lib/api";
import { Routes } from "@route/Routes";
import { useId, useRef, useState } from "react";
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

interface ItemSelectCardProps {
	item: AuctionItem;
	selected: boolean;
	onToggle: () => void;
}

function ItemSelectCard({ item, selected, onToggle }: ItemSelectCardProps) {
	const { value: product, isLoading: isProductLoading } = usePromise<Product>(
		() => fetch(API_URL + Routes.Product.Get(item.productId)).then(response => response.json()),
		[item.productId]
	);
	const { value: thumbnailProductImage } = usePromise<ProductImage>(
		() =>
			isProductLoading ?
				null :
				product.thumbnailImageId === null ?
				undefined :
				fetch(Routes.ProductImage.Get(product.thumbnailImageId)).then(response => response.json()),
		[isProductLoading, product?.thumbnailImageId]
	);
	if (product == null) return null;

	return (
		<div className={styles.productContainer}>
			<Checkbox checked={selected} onClick={onToggle}/>
			<div className={styles.product + (selected ? ` ${styles.selected}` : "")} onClick={onToggle}>
				{isProductLoading || product.thumbnailImageId == null ?
					null :
					(
						<Image className={styles.productImage} src={thumbnailProductImage.url}
							alt={`${product.name}'s thumbnail`}/>
					)} {/* TODO: Test */}
				<div>
					{/* TODO: Improve */}
					<Typography>{product.name}</Typography>
					<Typography>x{item.batchSize * item.count}</Typography>
				</div>
			</div>
		</div>
	);
}

export default function CreateAuctions() {
	const [productsSelected, setProductsSelected] = useState<Set<number>>(new Set());
	const [startingDate, setStartingDate] = useState<string>(getDefaultDate());
	const [startingTime, setStartingTime] = useState<string>(getDefaultTime());
	const id = useId();

	const auctionItems = useAPI<AuctionItem[]>(Routes.AuctionItem.GetAll);
	const [status, setStatus] = useState<Status>({ type: "none", label: "" });

	async function submitAuction() {
		const itemIds = Array.from(productsSelected);
		if (itemIds.length === 0) {
			setStatus({
				type: "error",
				label: "Please select at least one auction item."
			});
			return;
		}

		// combine startingDate and startingTime into an ISO datetime
		let startingTimeMillis: number | null = null;
		if (startingDate && startingTime) {
			const iso = `${startingDate}T${startingTime}:00`;
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
				<Typography heading={1} center>Create Auction</Typography>

				<Section>
					<Typography heading={3}>Available Auction Items:</Typography>

					{Array.isArray(auctionItems) ?
						(
							auctionItems.length ?
								(
									<div className={styles.productList}>
										{auctionItems.map(item => (
											<ItemSelectCard key={item.id} item={item}
												selected={productsSelected.has(item.id)} onToggle={() =>
												setProductsSelected(prev => {
													const next = new Set<number>(prev);
													if (prev.has(item.id)) next.delete(item.id);
													else next.add(item.id);
													return next;
												})}/>
										))}
									</div>
								) :
								<Typography>No auction items available</Typography>
						) :
						null}
				</Section>

				<Section>
					<Typography id={id + "startingDate"}>Starting date</Typography>
					<Input
						labelledby={id + "startingDate"}
						type="date"
						value={startingDate}
						onChange={setStartingDate}
					/>
					<Typography id={id + "startingTime"}>Starting time</Typography>
					<Input
						labelledby={id + "startingTime"}
						type="time"
						value={startingTime}
						onChange={setStartingTime}
					/>

					<Button variant="contained" color="brand" onClick={submitAuction}>Create Auction</Button>{" "}
					{/* TODO: Fix layout (Make the parent responsible for layout?) */}
				</Section>
				<Typography heading={2}>
					Selected Auction Item ID:
				</Typography>
				<Typography heading={3}>
					{productsSelected.size ? Array.from(productsSelected).join(", ") : "(none selected)"}
				</Typography>
				<StatusDisplay status={status}/>
			</div>
		</>
	);
}
