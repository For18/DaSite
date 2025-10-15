import { useEffect, useState } from "react";
import { API_URL, Product } from "../lib/api";
import Throbber from "./Throbber";
import Typography from "@mui/material/Typography";

export default function ProductView({ productId }: {
	productId: number
}) {
	const [product, setProduct] = useState<Product>();

	useEffect(() => {
		fetch(API_URL + "product/" + productId).then(response => response.json()).then(setProduct)
	}, [productId]);

	if (product == null) return <Throbber/>;

	return <Typography color="textPrimary">{product.name}</Typography>
}