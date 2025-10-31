import Throbber from "../components/Throbber";
import { Product } from "../lib/api";
import { ProductImage, useAPI, User } from "../lib/api";
import NotFound from "../routes/NotFound";
import "./styles/ProductView.css";

export default function ProductView({ product }: { product: Product }) {
	const owner = useAPI<User>("/user/" + product.owner) ?? null;
	const prodImages = useAPI<ProductImage[]>("/product-image/from/" + product.id);
	product.imageUrls = [];

	if (owner === null) return <Throbber/>;
	if (owner === undefined) return <NotFound/>;

	if (prodImages === null) return <Throbber/>;
	if (prodImages === undefined) return <NotFound/>;

	prodImages.forEach(prodImage => product.imageUrls.push(prodImage.url));

	return (
		<div className={"product-view"}>
			<div>
				<h2>{product.name}</h2>
				<p className={"seller"}>
					Seller: {owner ? owner.displayName : "Seller not found"}
				</p>
			</div>

			<hr className={"horizontal-rule"}/>

			<div>
				<p>{product.description}</p>
			</div>

			<hr className={"horizontal-rule"}/>

			<div>
				<img
					className={"thumbnail-image"}
					src={product.thumbnailImageUrl}
					alt={product.name}
				/>
			</div>

			<div className={"extra-image-container"}>
				{product.imageUrls.map((url, index) => (
					<div key={index} style={{ cursor: "pointer" }}>
						<img
							className={"extra-image"}
							src={url}
							alt={`Product Image ${index + 1}`}
							onClick={() => window.open(url, "_blank")}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
