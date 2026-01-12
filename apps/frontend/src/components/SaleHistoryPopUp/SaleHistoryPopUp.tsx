import { API_URL, type AuctionItem, type Product, PublicUser, type Sale, useAPI } from "@/lib/api";
import { Routes } from "@route/Routes";
import { useEffect, useMemo, useState } from "react";
import { CgClose } from "react-icons/cg";
import Button from "../Button";
import ClickAwayDetector from "../ClickAwayDetector";
import Modal from "../Modal";
import Table from "../Table/Table";
import Typography from "../Typography";
import styles from "./SaleHistoryPopUp.module.scss";
import { deduplicate } from "@/lib/util";
import usePromise from "@/lib/hooks/usePromise";

export interface SaleHistoryPopUpProps {
	item: AuctionItem;
	open: boolean;
	onClose: () => void;
}

interface Row {
	distributor?: PublicUser;
	date: string;
	price?: number;
	saleId: number;
}

const HISTORY_LENGTH = 10;

/* NOTE: this this has so many problems with styling but I aint dealing with that rn*/
export default function SaleHistoryPopUp({ item, open, onClose: close }: SaleHistoryPopUpProps) {
	const globalSales = useAPI<Sale[]>(Routes.Sale.GetHistory(item.productId));
	const currentOwnerSales = useAPI<Sale[]>(Routes.Sale.GetOwnerHistory(item.productId, item.ownerId));

	const distributors = useAPI<PublicUser[]>(globalSales == null ? null : Routes.User.BatchGetPublic(deduplicate(globalSales.map(sale => sale.distributorId))));

	const globalRows: Row[] = globalSales == null ? [] : globalSales.slice(0, HISTORY_LENGTH).map(sale => ({
		distributor: distributors?.find(user => user.id === sale.distributorId),
		date: new Date(Date.now()).toLocaleDateString(),
		price: sale.price,
		saleId: sale.id
	}));
	const currentOwnerRows: Omit<Row, "distributor">[] = currentOwnerSales == null ? [] : currentOwnerSales.slice(0, HISTORY_LENGTH).map(sale => ({
		date: new Date(Date.now()).toLocaleDateString(),
		price: sale.price,
		saleId: sale.id
	}));

	return (
		<>
			<Modal open={open} onClose={close}>
				{/* Current Owner History */}
				<Table>
					<tbody>
						<tr>
							<th>Date</th>
							<th>Price</th>
						</tr>
						{currentOwnerRows.map(entry => (
							<tr key={entry.saleId}>
								<td>{entry.date}</td>
								<td>{entry.price}</td>
							</tr>
						))}
					</tbody>
				</Table>
				<Typography>
					Average all-time price: {currentOwnerRows.reduce((acc, row) => acc + (row.price ?? 0), 0) / currentOwnerRows.reduce((acc, row) => acc + (row.price == null ? 0 : 1), 0)}
				</Typography>

				{/* All History */}
				<Table>
					<tbody>
						<tr>
							<th>Distributor</th>
							<th>Date</th>
							<th>Price</th>
						</tr>
						{globalRows.map(row => (
							<tr key={row.saleId}>
								<td>{row.distributor == null ? "-" : (row.distributor.userName ?? "Unnamed")}</td>
								<td>{row.date}</td>
								<td>{row.price}</td>
							</tr>
						))}
					</tbody>
				</Table>
				<Typography>
					Average all-time price: {globalRows.reduce((acc, row) => acc + (row.price ?? 0), 0) / globalRows.reduce((acc, row) => acc + (row.price == null ? 0 : 1), 0)}
				</Typography>
			</Modal>
		</>
	);
}
