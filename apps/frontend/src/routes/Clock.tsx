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
    plannerId: 1,
  } 
	const product: Product = {
		id: 1,
		name: "this is a product name",
		description: "description",
		thumbnailImageUrl: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fgdbenterprises.com%2Fwp-content%2Fuploads%2F2011%2F12%2Fgreen-beans-1.jpg&f=1&nofb=1&ipt=56b8996de43de72482cda0064592b39d61cb78a5b480014b3e6b2a1f98203341",
		imageUrls: ["url1", "url2"],
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
				alignItems: "start",
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
					overflowY: "auto",
				}}
			>
				{product == null ? <Throbber/> : <ProductView product={product}/>}
			</div>
		</div>
	);
}
