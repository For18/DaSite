import { Product } from "../lib/api";
import Typography from "./Typography";

export default function ProductView({ product }: {
	product: Product;
}) {
	return <Typography color="primary">{product.name}</Typography>;
}
