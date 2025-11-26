/// <reference types="vite/client" />

import { usePromise } from "./util";

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
	plannerId: number;
	startingTime: number;
}

export interface AuctionEntry {
	auctionId: number;
	itemId: number;
}

export interface AuctionItem {
	id: number;
	count: number;
	batchSize: number;
	startingPrice: number;
	minimumPrice: number;
	length: number;
	productId: number;
}

export interface User {
	id: number;
	auctionDebt: number;
	displayName: string;
	imageUrl: string;
	email: string;
	telephonenumber: number;
}

export function useAPI<T>(route: string | null): T | null | undefined {
	const { isLoading, value, error } = usePromise<T>(
		() => route !== null ? fetch(API_URL + route).then(response => response.json()) : null,
		[route]
	);

	if (isLoading) return null;
	if (error) return undefined;

	return value;
}
