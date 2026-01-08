import { type Sale, type AuctionItem, useAPI, type Product, API_URL, PublicUser } from "@/lib/api";
import { useEffect, useState } from "react";
import { Routes } from "@route/Routes";
import Button from "../Button";
import Typography from "../Typography";
import styles from "./SaleHistoryPopUp.module.scss";

export default function SaleHistoryPopUp({ item } : { item: AuctionItem }) {
  const product = useAPI<Product>(Routes.Product.Get(item.productId));
  const totalHistory = useAPI<Sale[]>(product ? Routes.Sale.GetHistory(product.id) : null);
  const slicedHistory = totalHistory ? totalHistory.slice(0, 10) : null;
  const [open, setOpen] = useState<boolean>(false);

  const [owners, setOwners] = useState<PublicUser[] | null>(null);
  const [items, setItems] = useState<AuctionItem[] | null>(null);
  /* TODO: account for possible missing items*/
  useEffect(() => {
      if (totalHistory == null) return;
      fetch(API_URL + Routes.AuctionItem.BatchGet, {
        credentials: "include",
        method: "GET",
        body: JSON.stringify(slicedHistory.map(e => e.purchasedItemId))
      })
      .then(response => response.json())
      .then(data => data as AuctionItem[])
      .then(items => setItems(items));
  }, [totalHistory]);
  useEffect(() => {
      if (items == null) return;
      fetch(API_URL + Routes.User.BatchGetPublic, {
        credentials: "include",
        method: "GET",
        body: JSON.stringify(items.map(e => e.ownerId))
      })
      .then(response => response.json())
      .then(data => data as PublicUser[])
      .then(owners => setOwners(owners));
  }, [items]);

  const totalCurrentItemOwnerHistory = useAPI<Sale[]>(product ? Routes.Sale.GetOwnerHistory(product.id, item.ownerId) : null)

  if (slicedHistory == null) return <> </>;
  if (totalCurrentItemOwnerHistory == null) return <> </>;
  
  // TODO: replace Date.now() with actual date property of Sale when its added
  const currentOwnerEntries: {date: string, price: string}[] = totalCurrentItemOwnerHistory 
  .slice(0, 10)
  .map(e => {
      return {date: String(Date.now()), price: String(e.price)};
  });

  const totalEntries : {owner: string, date: string, price: string}[] = [];
  slicedHistory 
    .slice(0, 10)
    .forEach((e, i) => {
        totalEntries.push({owner: owners[i].userName, date: String(Date.now()), price: String(e.price)})
    });

  // TODO: Decide if array padding is needed bc on Brightspace it explicitly says to show the last 10 sales) 
  // but this is ooglay
  while (currentOwnerEntries.length < 10) {
    currentOwnerEntries.push({date: '-', price: '-'});
  }
  while (totalEntries.length < 10) {
    totalEntries.push({owner: '-', date: '-', price: '-'});
  }

return (
  <>
  { 
    /* TODO: remove ternary logic to improve structure 
     * TODO: extract to separate component?
     */
  }
    {open ? (
      <div className={styles.historyList} id="popover" popover="manual">
        {/* Current Owner History */}
        <div className={styles.currentOwnerHistory}>
          <div className={styles.leftColumn}>
            <Typography>Date</Typography>
            <div className={styles.scrollContainer}>
              {currentOwnerEntries.map((e, i) => (
                <Typography key={i}>{e.date}</Typography>
              ))}
            </div>
          </div>
          <div className={styles.rightColumn}>
            <Typography>Price</Typography>
            <div className={styles.scrollContainer}>
              {currentOwnerEntries.map((e, i) => (
                <Typography key={i}>{e.price}</Typography>
              ))}
            </div>
          </div>
        </div>
        <Typography>
          Average price per{" "}
          {currentOwnerEntries
            .map((e) => (e.price === "-" ? 0 : Number(e.price)))
            .reduce((acc, curr) => acc + curr, 0)}
        </Typography>

        {/* All History */}
        <div className={styles.allHistory}>
          <div className={styles.leftColumn}>
            <Typography>Distributer</Typography>
            <div className={styles.scrollContainer}>
              {totalEntries.map((e, i) => (
                <Typography key={i}>{e.owner}</Typography>
              ))}
            </div>
          </div>
          <div className={styles.middleColumn}>
            <Typography>Date</Typography>
            <div className={styles.scrollContainer}>
              {totalEntries.map((e, i) => (
                <Typography key={i}>{e.date}</Typography>
              ))}
            </div>
          </div>
          <div className={styles.rightColumn}>
            <Typography>Price</Typography>
            <div className={styles.scrollContainer}>
              {totalEntries.map((e, i) => (
                <Typography key={i}>{e.price}</Typography>
              ))}
            </div>
          </div>
        </div>
        <Typography>
          Average price per{" "}
          {totalEntries
            .map((e) => (e.price === "-" ? 0 : Number(e.price)))
            .reduce((acc, curr) => acc + curr, 0)}
        </Typography>
      </div>
    ) : (
      <Button onClick={() => setOpen(true)}>History</Button>
    )}
  </>
);
}
