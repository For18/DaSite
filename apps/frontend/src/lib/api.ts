/// <reference types="vite/client" />

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
	product: number;
	planner: number;
};
