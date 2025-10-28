import { Product } from "../lib/api";
import { API_URL, Auction, User, useAPI } from "../lib/api";

export default function ProductView({ product }: { product: Product }) {

	const owner = useAPI<User>("/user/" + product.owner) ?? null;

	return (
		<div
			style={{
				padding: "20px",
				fontFamily: "Arial, sans-serif",
				lineHeight: "1.6"
			}}
		>
			<div>
				<h2>{product.name}</h2>
				<p style={{ fontSize: "1.1em", color: "#555" }}>
					Seller: {owner ? owner.displayName : "Seller not found"}
				</p>
			</div>

			<hr style={{ border: "1px solid #ccc", margin: "20px 0" }}/>

			<div>
				<p>{product.description}</p>
			</div>

			<hr style={{ border: "1px solid #ccc", margin: "20px 0" }}/>

			<div>
				<img
					src={product.thumbnailImageUrl}
					alt={product.name}
					style={{
						width: "100%",
						height: "auto",
						borderRadius: "8px"
					}}
				/>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
					gap: "10px",
					marginTop: "20px"
				}}
			>
				{product.imageUrls.map((url, index) => (
					<div key={index} style={{ cursor: "pointer" }}>
						<img
							src={url}
							alt={`Product Image ${index + 1}`}
							style={{
								width: "100%",
								height: "auto",
								borderRadius: "8px",
								boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
								transition: "transform 0.3s ease"
							}}
							onClick={() => window.open(url, "_blank")}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
