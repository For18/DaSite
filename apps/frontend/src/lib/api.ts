/// <reference types="vite/client" />

import { useEffect, useState } from "react";

export const API_URL: string = import.meta.env.VITE_API_URL;

export interface Sale {
	id: number;
	purchaserId: number;
	purchasedAuctionId: number;
	amount: number;
	price: number;
	isPaid: boolean;
}

export interface Product {
	id: number;
	name: string;
	description: string;
	thumbnailImageId: number;
	ownerId: number;
}

export interface ProductImage {
	id: number;
	parent: number;
	url: string;
}

export interface Auction {
	id: number;
	count: number;
	batchSize: number;
	startingPrice: number;
	minimumPrice: number;
	startingTime: number;
	length: number;
	productId: number;
	plannerId: number;
}

export interface User {
	id: number;
	auctionDebt: number;
	userName?: string;
	avatarImageUrl?: string;
	email?: string;
	telephonenumber: number;
}

interface UseAPIOptions {
	method?: "GET" | "POST" | "PATCH" | "DELETE";
	body?: {} | Array<any>;
	headers?: Record<string, string>;
}

export function useAPI<T>(route: string | null, options: UseAPIOptions = {}): T | null | undefined {
	const { method = "GET", body, headers } = options;
	const [value, setValue] = useState<T | null | undefined>(null);

	useEffect(() => {
		setValue(null);
		if (route === null) return;
		fetch(API_URL + route, {
			method,
			headers: {
				"Content-Type": "application/json",
				...headers
			},
			body: body ? JSON.stringify(body) : undefined
		})
			.then(response => {
				if (response.status == 404) return undefined;
				return response.json();
			}).then(setValue);
	}, [route]);

	return value;
}
