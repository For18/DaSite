import Typography from "@mui/material/Typography";
import { Product } from "../lib/api";

export default function ProductView({ product }: {
	product: Product;
}) {
	return <Typography color="textPrimary">{product.name}</Typography>;
}
