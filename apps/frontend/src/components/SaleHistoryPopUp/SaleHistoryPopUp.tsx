import { API_URL, type AuctionItem, type Product, PublicUser, type Sale, useAPI } from "@/lib/api";
import { Routes } from "@route/Routes";
import { useEffect, useMemo, useState } from "react";
import { CgClose } from "react-icons/cg";
import Button from "../Button";
import ClickAwayDetector from "../ClickAwayDetector";
import Typography from "../Typography";
import styles from "./SaleHistoryPopUp.module.scss";

export interface SaleHistoryPopUpProps {
	item: AuctionItem;
	open: boolean;
	onClose: () => void;
}

/* NOTE: this this has so many problems with styling but I aint dealing with that rn*/
export default function SaleHistoryPopUp({ item, open, onClose: close }: SaleHistoryPopUpProps) {
	const product = useAPI<Product>(Routes.Product.Get(item.productId));
	const totalHistory = useAPI<Sale[]>(product ? Routes.Sale.GetHistory(product.id) : null);
	const slicedHistory = totalHistory ? totalHistory.slice(0, 10) : null;

	const [owners, setOwners] = useState<PublicUser[] | null>(null);
	const [items, setItems] = useState<AuctionItem[] | null>(null);
	/* TODO: account for possible missing items*/
	useEffect(() => {
		if (totalHistory == null) return;
		fetch(API_URL + Routes.AuctionItem.BatchGet(slicedHistory.map(e => e.purchasedItemId)), {
			credentials: "include"
		})
			.then(response => response.json())
			.then(data => data as AuctionItem[])
			.then(items => setItems(items));
	}, [totalHistory]);
	useEffect(() => {
		if (items == null) return;
		fetch(API_URL + Routes.User.BatchGetPublic(items.map(e => e.ownerId)), {
			credentials: "include"
		})
			.then(response => response.json())
			.then(data => data as PublicUser[])
			.then(owners => setOwners(owners));
	}, [items]);

	const totalCurrentItemOwnerHistory = useAPI<Sale[]>(
		product ? Routes.Sale.GetOwnerHistory(product.id, item.ownerId) : null
	);

	// TODO: replace Date.now() with actual date property of Sale when its added
	const currentOwnerEntries: { date: string, price: string }[] = useMemo(() => {
		if (totalCurrentItemOwnerHistory == null) return [];
		return totalCurrentItemOwnerHistory
			.slice(0, 10)
			.map(e => ({
				date: new Date(Date.now()).toLocaleDateString(),
				price: String(e.price)
			}));
	}, [totalCurrentItemOwnerHistory]);

	const totalEntries: { owner: string, date: string, price: string }[] = useMemo(() => {
		if (owners == null || slicedHistory == null) return [];
		return slicedHistory
			.slice(0, 10)
			.map((e, i) => ({
				owner: owners[i].userName,
				date: String(Date.now()),
				price: String(e.price)
			}));
	}, [owners, slicedHistory]);
		
	// TODO: Decide if array padding is needed bc on Brightspace it explicitly says to show the last 10 sales)
	// but this is ooglay
	while (currentOwnerEntries.length < 10) {
		currentOwnerEntries.push({ date: "-", price: "-" });
	}
	while (totalEntries.length < 10) {
		totalEntries.push({ owner: "-", date: "-", price: "-" });
	}

	if (slicedHistory == null) return <></>;
	if (totalCurrentItemOwnerHistory == null) return <></>;

	return (
		<>
			{
				/* TODO: extract modal to separate component */
			}
			{open ?
				(
					<div className={styles.historyList} id="popover" popover="manual">
						{/* Current Owner History */}
						<div className={styles.currentOwnerHistory}>
							<div className={styles.leftColumn}>
								<Typography>Date</Typography>
								<div className={styles.scrollContainer}>
									{currentOwnerEntries.map((e, i) => <Typography key={i}>{e.date}</Typography>)}
								</div>
							</div>
							<div className={styles.rightColumn}>
								<Typography>Price</Typography>
								<div className={styles.scrollContainer}>
									{currentOwnerEntries.map((e, i) => <Typography key={i}>{e.price}</Typography>)}
								</div>
							</div>
						</div>
						<Typography>
							Average all-time price: {currentOwnerEntries
								.map(e => (e.price === "-" ? 0 : Number(e.price)))
								.reduce((acc, curr) => acc + curr, 0)}
						</Typography>

						{/* All History */}
						<div className={styles.allHistory}>
							<div className={styles.leftColumn}>
								<Typography>Distributor</Typography>
								<div className={styles.scrollContainer}>
									{totalEntries.map((e, i) => <Typography key={i}>{e.owner}</Typography>)}
								</div>
							</div>
							<div className={styles.middleColumn}>
								<Typography>Date</Typography>
								<div className={styles.scrollContainer}>
									{totalEntries.map((e, i) => <Typography key={i}>{e.date}</Typography>)}
								</div>
							</div>
							<div className={styles.rightColumn}>
								<Typography>Price</Typography>
								<div className={styles.scrollContainer}>
									{totalEntries.map((e, i) => <Typography key={i}>{e.price}</Typography>)}
								</div>
							</div>
						</div>
						<Typography>
							Average all-time price: {totalEntries
								.map(e => (e.price === "-" ? 0 : Number(e.price)))
								.reduce((acc, curr) => acc + curr, 0)}
						</Typography>
						<Button className={styles.closeButton} onClick={close}>
							<CgClose/>
						</Button>
					</div>
				) :
				null}
		</>
	);
}
