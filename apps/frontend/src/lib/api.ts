/// <reference types="vite/client" />

import { useDebugValue } from "react";
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
	userName: string;
	normalizedUserName: string;
	email: string;
	normalizedEmail: string;
	emailConfirmed: boolean;
	passwordHash: string;
	securityStamp: string;
	concurrencyStamp: string;
	phoneNumber: string;
	phoneNumberConfirmed: boolean;
	twoFactorEnabled: boolean;
	lockoutEnd: string;
	lockoutEnabled: boolean;
	accessFailedCount: number;
	auctionDebt: number;
	avatarImageUrl: string;
	telephoneNumber: number;
}

export interface PublicUser {
	id: number;
	userName?: string;
	avatarImageUrl?: string;
	email?: string;
	telephoneNumber?: string;
}

export function useAPI<T>(route: string | null): T | null | undefined {
	const { isLoading, value, error } = usePromise<T>(
		() => route !== null ? fetch(API_URL + route).then(response => response.json()) : null,
		[route]
	);

	useDebugValue(isLoading ? "Loading..." : error != null ? error : value);

	if (isLoading) return null;
	if (error) return undefined;

	return value;
}
