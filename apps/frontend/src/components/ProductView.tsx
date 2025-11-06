import Typography from "./Typography";
import { Product } from "../lib/api";

export default function ProductView({ product }: {
	product: Product;
}) {
	return <Typography color="primary">{product.name}</Typography>;
}
