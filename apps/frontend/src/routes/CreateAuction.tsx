import { useState, useRef } from "react";
import ProductView from "../components/ProductView";
import Throbber from "../components/Throbber";
import Typography from "../components/Typography";
import { Product, useAPI, API_URL } from "../lib/api";
import styles from "./CreateAuction.module.scss";


export default function CreateAuctions() {
    const committedAuctionName = useRef<string>("");
    const [productsSelected, setProductsSelected] = useState<string[]>([]);
    const [count, setCount] = useState(1);
    const [batchSize, setBatchSize] = useState(1);
    const [startingPrice, setStartingPrice] = useState(0);
    const [minimumPrice, setMinimumPrice] = useState(0);
    const [durationSeconds, setDurationSeconds] = useState(120);
    // starting date/time states (date: YYYY-MM-DD, time: HH:mm)
    const now = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
    const defaultDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const defaultTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const startingDateRef = useRef<string>(defaultDate);
    const startingTimeRef = useRef<string>(defaultTime);

    const products = useAPI<Product[]>("/products");
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    async function submitAuction() {
        const productIds = productsSelected.map(Number).filter(id => !Number.isNaN(id));
        if (productIds.length === 0) {
            setStatusMessage("Please select at least one product.");
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
            productIds: productIds,
            plannerId: null
        } as any;

        try {
            setStatusMessage("Creating auction...");
            const resp = await fetch(API_URL + "/auction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!resp.ok) {
                const text = await resp.text();
                setStatusMessage(`Failed to create auction: ${resp.status} ${text}`);
                return;
            }

            const data = await resp.json();
            setStatusMessage(`Created auction id=${data?.id ?? data?.Id ?? "(unknown)"}`);
        } catch (err) {
            setStatusMessage(String(err));
        }
    }

    return (
        <>
                <div className={styles.container}>
                    <Typography heading={1}>Create Auction</Typography>


                    <Typography>Available Products:</Typography>
                    

                    {Array.isArray(products) ? (
                        <div className={styles.productList}>
                            {products.map(p => (
                                <label
                                    key={p.id}
                                    className={styles.product + (productsSelected.includes(String(p.id)) ? ` ${styles.selected}` : "")}
                                >
                                    <input
                                        className={styles.radio}
                                        type="checkbox"
                                        name="productId"
                                        value={String(p.id)}
                                        checked={productsSelected.includes(String(p.id))}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setProductsSelected(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
                                        }}
                                    />
                                    {p.name}
                                </label>
                            ))}
                        </div>
                    ) : null}
                    <Typography>Count:</Typography>
                    <input
                        className={styles.input}
                        name="count"
                        type="number"
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        placeholder="Enter count"
                    />

                    <Typography>Batch Size:</Typography>
                    <input
                        className={styles.input}
                        name="batchSize"
                        type="number"
                        value={batchSize}
                        onChange={(e) => setBatchSize(Number(e.target.value))}
                        placeholder="Enter batch size"
                    />

                    <Typography>Starting Price:</Typography>
                    <input
                        className={styles.input}
                        name="startingPrice"
                        type="number"
                        value={startingPrice}
                        onChange={(e) => setStartingPrice(Number(e.target.value))}
                        placeholder="Enter starting price"
                    />

                    <Typography>Minimum Price:</Typography>
                    <input
                        className={styles.input}
                        name="minimumPrice"
                        type="number"
                        value={minimumPrice}
                        onChange={(e) => setMinimumPrice(Number(e.target.value))}
                        placeholder="Enter minimum price"
                    />
                    <Typography>Starting date:</Typography>
                    <input
                        className={styles.input}
                        name="startingDate"
                        type="date"
                        defaultValue={startingDateRef.current}
                        onChange={(e) => (startingDateRef.current = e.target.value)}
                    />
                    <Typography>Starting time:</Typography>
                    <input
                        className={styles.input}
                        name="startingTime"
                        type="time"
                        defaultValue={startingTimeRef.current}
                        onChange={(e) => (startingTimeRef.current = e.target.value)}
                    />
                    <Typography>Duration (seconds):</Typography>
                    <input
                        className={styles.input}
                        name="durationSeconds"
                        type="number"
                        value={durationSeconds}
                        onChange={(e) => setDurationSeconds(Number(e.target.value))}
                        placeholder="Enter duration in seconds"
                    />
                    <button className={styles.button} onClick={submitAuction}>Create Auction</button>
                    <Typography heading={2}>Selected Products: {productsSelected.length ? productsSelected.join(', ') : "(none selected)"}</Typography>
                    {statusMessage && <Typography className={styles.status}>{statusMessage}</Typography>}
                </div>

        </>
    );
}
