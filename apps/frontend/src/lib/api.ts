/// <reference types="vite/client" />

import { useEffect, useState } from "react";

export const API_URL: string = import.meta.env.VITE_API_URL;

export type Product = {
	id: number;
	name: string;
	description: string;
	thumbnailImageUrl: string;
	imageUrls: string[];
	owner: number;
};

export type Auction = {
	id: number;
	count: number;
	batchSize: number;
	startingPrice: number;
	minimumPrice: number;
	startingTime: number;
	productId: number;
	plannerId: number;
};

export type User = {
	displayName: string;
	imageUrl: string;
	email: string;
	telephoneNumber: number;
};

export function useAPI<T>(route: string): T | null | undefined {
	const [value, setValue] = useState<T | null | undefined>(null);

	useEffect(() => {
		setValue(null);
		fetch(API_URL + route).then(response => {
			if (response.status == 404) return undefined;
			return response.json();
		}).then(setValue);
	}, [route]);

	return value;
}
