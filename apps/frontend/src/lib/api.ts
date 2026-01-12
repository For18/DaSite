/// <reference types="vite/client" />

import usePromise from "@lib/hooks/usePromise";
import { useDebugValue } from "react";

export const API_URL: string = import.meta.env.VITE_API_URL;

export type UserRole = "Admin" | "AuctionMaster" | "Customer";

export interface Sale {
	id: number;
	purchaserId: number;
	purchasedItemId: number;
	amount: number;
	price: number;
	isPaid: boolean;
}

export interface Product {
	id: number;
	name: string;
	description: string;
	thumbnailImageId: number;
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
	ownerId: number;
	length: number;
	productId: number;
}

export interface User {
	id: string;
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
	id: string;
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
