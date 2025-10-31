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

export type ProductImage = {
	id: number;
	parent: number;
	url: string;
};

export type Auction = {
	id: number;
	count: number;
	batchSize: number;
	startingPrice: number;
	minimumPrice: number;
	startingTime: number;
	length: number;
	productId: number;
	plannerId: number;
};

export type User = {
	id: number;
	displayName: string;
	email: string;
	telephonenumber: number;
};

export function useAPI<T>(route: string | null): T | null | undefined {
	const [value, setValue] = useState<T | null | undefined>(null);

	useEffect(() => {
		setValue(null);
		fetch(API_URL + route).then(response => {
			if (response.status == 404) return setValue(undefined);
			return response.json();
		}).then(setValue);
	}, [route]);

	return value;
}
