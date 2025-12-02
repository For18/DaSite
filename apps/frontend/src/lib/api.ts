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

interface UseAPIOptions {
	method?: "GET" | "POST" | "PATCH" | "DELETE";
	body?: {} | Array<any>;
	headers?: Record<string, string>;
}

export function useAPI<T>(route: string | null, options: UseAPIOptions = {}): T | null | undefined {
  const {method = "GET", body, headers} = options;
	const [value, setValue] = useState<T | null | undefined>(null);

	useEffect(() => {
		setValue(null);
		if (route === null) return;
		fetch(API_URL + route,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: body ? JSON.stringify(body): undefined,
        }
    )
    .then(response => {
			if (response.status == 404) return undefined;
			return response.json();
		}).then(setValue);
	}, [route]);

	return value;
}
