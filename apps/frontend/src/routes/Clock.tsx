import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AuctionClock from "../components/Clock";
import ProductView from "../components/ProductView";
import Throbber from "../components/Throbber";
import { API_URL, Auction, Product, useAPI } from "../lib/api";
import NotFound from "./NotFound";

export default function Clock() {
	const { auctionId } = useParams();
	// const auction = useAPI<Auction>("/auction/" + auctionId);
	// if (auction == undefined) return <NotFound/>;

	// const product = useAPI<Product>("/product" + auction.productId);
	const auction: Auction = {
		id: 1,
		count: 1,
		batchSize: 1,
		startingPrice: 100000,
		minimumPrice: 1000,
		startingTime: 1,
		productId: 1,
		plannerId: 1
	};
	const product: Product = {
		id: 1,
		name: "this is a product name",
		description: "this is a cool description",
		thumbnailImageUrl:
			"https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fgdbenterprises.com%2Fwp-content%2Fuploads%2F2011%2F12%2Fgreen-beans-1.jpg&f=1&nofb=1&ipt=56b8996de43de72482cda0064592b39d61cb78a5b480014b3e6b2a1f98203341",
		imageUrls: ["https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F58%2F91%2F9b%2F58919b9d620bcbf61500bb25deeea962.jpg&f=1&nofb=1&ipt=34f39ee8283d317de6ccbfb28ce8b91b854b0b8287cc879ecb1da2cb636266bc", "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F5d%2Fc2%2F4e%2F5dc24ed911e04089c6a19ebc595036c7.jpg&f=1&nofb=1&ipt=7e82689cc0f4b4fa5ab8fc6ccab87cc67772f6d1ed9bdb989768a0813ab56f21"],
		owner: 123
	};

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gridGap: "20px",
				marginBottom: "100px",
				alignItems: "start"
			}}
		>
			{/* Left Column Clock */}
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					paddingLeft: "20px",
					paddingTop: "200px"
				}}
			>
				<AuctionClock Auction={auction}/>
			</div>

			{/* Right Column Product Info */}
			<div
				style={{
					display: "flex",
					justifyContent: "flex-start",
					alignItems: "flex-start",
					padding: "20px",
					maxHeight: "calc(100vh - 100px)",
					overflowY: "auto"
				}}
			>
				{product == null ? <Throbber/> : <ProductView product={product}/>}
			</div>
		</div>
	);
}
