import useAuth from "@/AuthProvider";
import Button from "@component/Button";
import Image from "@component/Image";
import Input from "@component/Input";
import Section from "@component/Section";
import { Option, Select } from "@component/Select";
import { type Status, StatusDisplay } from "@component/StatusDisplay";
import Typography from "@component/Typography";
import { API_URL, type Product, type ProductImage, type PublicUser, useAPI } from "@lib/api";
import usePromise from "@lib/hooks/usePromise";
import { Routes } from "@route/Routes";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./CreateAuctionItem.module.scss";

interface ProductSelectCardProps {
	product: Product;
	selected: boolean;
	onToggle: () => void;
}

function ProductSelectCard({ product, selected, onToggle }: ProductSelectCardProps) {
	const { value: thumbnailProductImage } = usePromise<ProductImage>(
		() =>
			product.thumbnailImageId === null ?
				undefined :
				fetch(Routes.ProductImage.Get(product.thumbnailImageId)).then(response => response.json()),
		[product?.thumbnailImageId]
	);

	return (
		<div
			className={styles.product + (selected ? ` ${styles.selected}` : "")}
			onClick={onToggle}
			role="button"
			tabIndex={0}
		>
			{product.thumbnailImageId != null && thumbnailProductImage?.url && (
				<Image
					className={styles.productImage}
					src={thumbnailProductImage.url}
					alt={`${product.name}'s thumbnail`}
				/>
			)}
			<div>
				<Typography>{product.name}</Typography>
			</div>
		</div>
	);
}

export default function CreateAuctionItem() {
	const auth = useAuth();
	const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
	const [count, setCount] = useState<string>("1");
	const [batchSize, setBatchSize] = useState<string>("1");
	const [startingPrice, setStartingPrice] = useState<string>("0");
	const [minimumPrice, setMinimumPrice] = useState<string>("0");
	const [length, setLength] = useState<string>("60");
	const id = useId();

	const isAdmin = auth.role === "Admin";

	const [ownerSearchValue, setOwnerSearchValue] = useState<string>("");
	const foundUsersIndexRef = useRef<number>(0);
	const [owner, setOwner] = useState<PublicUser | null>(null);
	const [foundUsers, setFoundUsers] = useState<PublicUser[]>([]);

	useEffect(() => {
		if (isAdmin && ownerSearchValue) {
			fetch(API_URL + Routes.User.GetAllByName(ownerSearchValue))
				.then(response => response.json())
				.then(data => data as PublicUser[])
				.then(users => setFoundUsers(users));
		}
	}, [ownerSearchValue, isAdmin]);

	const products = useAPI<Product[]>(Routes.Product.GetAll);
	const [status, setStatus] = useState<Status>({ type: "none", label: "" });

	async function submitAuctionItem() {
		if (selectedProductId === null) {
			setStatus({
				type: "error",
				label: "Please select a product."
			});
			return;
		}

		const countNum = parseInt(count);
		const batchSizeNum = parseInt(batchSize);
		const startingPriceNum = parseInt(startingPrice);
		const minimumPriceNum = parseInt(minimumPrice);
		const lengthNum = parseInt(length);

		if (isNaN(countNum) || countNum <= 0) {
			setStatus({ type: "error", label: "Count must be a positive number." });
			return;
		}
		if (isNaN(batchSizeNum) || batchSizeNum <= 0) {
			setStatus({ type: "error", label: "Batch size must be a positive number." });
			return;
		}
		if (isNaN(startingPriceNum) || startingPriceNum < 0) {
			setStatus({ type: "error", label: "Starting price must be a non-negative number." });
			return;
		}
		if (isNaN(minimumPriceNum) || minimumPriceNum < 0) {
			setStatus({ type: "error", label: "Minimum price must be a non-negative number." });
			return;
		}
		if (isNaN(lengthNum) || lengthNum <= 0) {
			setStatus({ type: "error", label: "Length must be a positive number." });
			return;
		}

		const ownerId = isAdmin ? owner?.id : auth.user?.id;

		if (!isAdmin && !auth.user?.id) {
			setStatus({
				type: "error",
				label: "You must be logged in to create an auction item."
			});
			return;
		}

		const payload = {
			id: 0,
			count: countNum,
			batchSize: batchSizeNum,
			startingPrice: startingPriceNum,
			minimumPrice: minimumPriceNum,
			length: lengthNum,
			productId: selectedProductId,
			ownerId: ownerId
		};

		try {
			setStatus({
				type: "progress",
				label: "Creating auction item..."
			});

			const resp = await fetch(API_URL + Routes.AuctionItem.Post, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});

			if (!resp.ok) {
				const text = await resp.text();
				setStatus({
					type: "error",
					label: `Failed to create auction item: ${resp.status} ${text}`
				});
				return;
			}

			const data = await resp.json();
			const createdId = data?.id ?? data?.Id ?? null;
			setStatus({
				type: "success",
				label: `Created auction item id=${createdId ?? "(unknown)"}`
			});

			// Reset form
			setSelectedProductId(null);
			setCount("1");
			setBatchSize("1");
			setStartingPrice("0");
			setMinimumPrice("0");
			setLength("60");
			setOwner(null);
			setOwnerSearchValue("");
			setFoundUsers([]);
		} catch (err) {
			setStatus({
				type: "error",
				label: String(err)
			});
		}
	}

	return (
		<div className={styles.container}>
			<Typography heading={1} center>Create Auction Item</Typography>

			<Section>
				<Typography heading={3}>Select Product:</Typography>

				{Array.isArray(products) ?
					(
						products.length ?
							(
								<div className={styles.productList}>
									{products.map(product => (
										<ProductSelectCard
											key={product.id}
											product={product}
											selected={selectedProductId === product.id}
											onToggle={() =>
												setSelectedProductId(prev => prev === product.id ? null : product.id)}
										/>
									))}
								</div>
							) :
							<Typography>No products available</Typography>
					) :
					null}
			</Section>

			<Section>
				<Typography heading={3}>Auction Item Details:</Typography>

				{isAdmin && (
					<>
						<Typography id={id + "owner"}>Owner</Typography>
						<div>
							<Input
								id={id + "owner-search"}
								placeholder="Search for Users"
								value={ownerSearchValue}
								type="text"
								onChange={value => setOwnerSearchValue(String(value))}
							/>
							<Select
								aria-labelledby={id + "owner-search"}
								value={owner?.userName?.length == 0 ? null : owner?.userName ?? null}
								onChange={(value: string) => {
									foundUsersIndexRef.current = Number(value);
									setOwner(foundUsers[foundUsersIndexRef.current]);
								}}
								placeholder="Select a User"
							>
								{foundUsers.map((entry, index) => (
									<Option key={entry.id} value={String(index)}>{entry.userName}</Option>
								))}
							</Select>
						</div>
					</>
				)}

				<Typography id={id + "count"}>Count</Typography>
				<Input
					labelledby={id + "count"}
					type="number"
					value={count}
					onChange={setCount}
				/>

				<Typography id={id + "batchSize"}>Batch Size</Typography>
				<Input
					labelledby={id + "batchSize"}
					type="number"
					value={batchSize}
					onChange={setBatchSize}
				/>

				<Typography id={id + "startingPrice"}>Starting Price</Typography>
				<Input
					labelledby={id + "startingPrice"}
					type="number"
					value={startingPrice}
					onChange={setStartingPrice}
				/>

				<Typography id={id + "minimumPrice"}>Minimum Price</Typography>
				<Input
					labelledby={id + "minimumPrice"}
					type="number"
					value={minimumPrice}
					onChange={setMinimumPrice}
				/>

				<Typography id={id + "length"}>Length (seconds)</Typography>
				<Input
					labelledby={id + "length"}
					type="number"
					value={length}
					onChange={setLength}
				/>

				<Button variant="contained" color="brand" onClick={submitAuctionItem}>
					Create Auction Item
				</Button>
			</Section>

			<Typography heading={2}>
				Selected Product ID:
			</Typography>
			<Typography heading={3}>
				{selectedProductId ?? "(none selected)"}
			</Typography>
			<StatusDisplay status={status}/>
		</div>
	);
}
