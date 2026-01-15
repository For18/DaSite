import type { Auction, AuctionItem, Product, ProductImage, Sale, User } from "@lib/api";
import { type JSX, lazy, type LazyExoticComponent } from "react";

const Home = lazy(() => import("./Home"));
const Clock = lazy(() => import("./Clock"));
const Auctions = lazy(() => import("./Auctions"));
const PendingAuction = lazy(() => import("./PendingAuction"));
const Profile = lazy(() => import("./Profile"));
const CreateProduct = lazy(() => import("./CreateProduct"));
const Test = lazy(() => import("./Test"));
const CreateAuction = lazy(() => import("./CreateAuction"));
const CreateAuctionItem = lazy(() => import("./CreateAuctionItem"));
const Login = lazy(() => import("./Auth/Login"));
const Registration = lazy(() => import("./Auth/Registration"));

export const Routes = {
	Pages: {
		Home: `/`,
		Clock: (id: Auction["id"]) => `/clock/${id}`,
		Auctions: {
			Base: "/auctions",
			Create: "/auctions/create",
			Pending: "/auctions/pending",
			Items: "/auctions/items/"
		},
		CreateProduct: "/products/create",
		Profile: (id: User["id"]) => `/profile/${id}`,
		Test: "/test",
		Login: "/login",
		Register: "/register"
	},
	User: {
		GetPublic: (id: User["id"]) => `/user/${id}`,
		GetPrivate: (id: User["id"]) => `/user/private/${id}`,
		GetUserRole: "/user/private/role",
		BatchGetPrivate: "/users/private/batch",
		BatchGetPublic: (ids: User["id"][]) => `/users/batch?ids=${ids.join(",")}`,
		GetAllPrivate: "/users/private",
		GetAllPublic: "/users",
		GetAllByName: (name: string) => `/users/by-name/${name}`,
		GetCurrent: "/private/current",
		Post: "/user",
		BatchPost: "/users/batch",
		Delete: (id: User["id"]) => `/user/${id}`,
		BatchDelete: "/users/batch",
		Patch: (id: User["id"]) => `/user/${id}`
	},

	Sale: {
		Get: (id: Sale["id"]) => `/sale/${id}`,
		GetHistory: (productId: Product["id"]) => `/sale/history/${productId}`,
		GetOwnerHistory: (productId: Product["id"], ownerId: User["id"]) =>
			`/sale/owner-history/${ownerId}/${productId}`,
		GetByAuction: (auctionId: Auction["id"]) => `/sale/by-auction/${auctionId}`,
		GetAll: "/sales",
		GetBatch: "/sales/batch",
		Post: "/sale",
		PostBatch: "/sales/batch",
		Delete: (id: Sale["id"]) => `/sale/${id}`,
		DeleteSale: "/sales/delete",
		Patch: (id: Sale["id"]) => `/sale/${id}`
	},

	ProductImage: {
		Get: (id: ProductImage["id"]) => `/product-image/${id}`,
		FromParent: (parentId: Product["id"]) => `/product-image/from/${parentId}`,
		BatchGet: "/product-images/batch",
		Post: "/product-image",
		BatchPost: "/product-images/batch",
		Delete: (id: ProductImage["id"]) => `/product-image/${id}`,
		BatchDelete: "/product-image/batch",
		Patch: (id: ProductImage["id"]) => `/product-image/${id}`
	},

	Product: {
		Get: (id: Product["id"]) => `/product/${id}`,
		GetAll: "/products",
		GetOfUser: (userId: User["id"]) => `/products/user/${userId}`,
		BatchGet: (productIds: Product["id"][]) => `/products/batch?${productIds.map(id => `ids=${id}`).join("&")}`,
		Post: "/product",
		BatchPost: "/product/batch",
		Delete: (id: Product["id"]) => `/product/${id}`,
		BatchDelete: "/products/batch",
		Patch: (id: Product["id"]) => `/product/${id}`
	},

	AuctionItem: {
		GetAll: "/auction-item/all",
		Get: (id: AuctionItem["id"]) => `/auction-item/${id}`,
		BatchGet: (ids: AuctionItem["id"][]) => `/auction-items/batch?ids=${ids.join(",")}`,
		GetByAuction: (auctionId: Auction["id"]) => `/auction-item/by-auction/${auctionId}`,
		Post: "/auction-item",
		BatchPost: "/auction-item/batch",
		Delete: (id: AuctionItem["id"]) => `/auction-item/${id}`,
		BatchDelete: "/auction-item/batch",
		Patch: (id: AuctionItem["id"]) => `/auction-item/${id}`
	},

	AuctionEntry: {
		GetBatch: "/auction-entries/batch",
		GetFromAuction: (auctionId: Auction["id"]) => `/auction-entry/from-auction/${auctionId}`,
		GetFromItem: (itemId: AuctionItem["id"]) => `/auction-entry/from-item/${itemId}`,
		Post: "/auction-entry",
		BatchPost: "/auction-entries/batch",
		Delete: (auctionId: Auction["id"], itemId: AuctionItem["id"]) => `/auction-entry/${auctionId}/${itemId}`,
		BatchDelete: "/auction-entries/batch"
	},

	Auction: {
		Get: (id: Auction["id"]) => `/auction/${id}`,
		BatchGet: "/auctions/batch",
		GetAll: "/auctions",
		GetUpcoming: "/auctions/upcoming",
		Post: "/auction",
		BatchPost: "/auctions/batch",
		Delete: (id: Auction["id"]) => `/auction/${id}`,
		BatchDelete: "/auctions/batch",
		Patch: (id: Auction["id"]) => `/auction/${id}`
	},
	Identity: {
		PostRegister: "/identity/register",
		PostLogin: "/identity/login",
		PostRefresh: "/identity/refresh",
		GetConfirmEmail: "/identity/confirmEmail",
		PostResendConfirmEmail: "/identity/resendConfirmEmail",
		PostForgotPassword: "/identity/forgotPassword",
		PostResetPassword: "/identity/resetPassword",
		PostManage2fa: "/identity/manage/2fa",
		GetManageInfo: "/identity/manage/info",
		PostManageInfo: "/identity/manage/info",
		PostLogout: "/identity/account/logout"
	}
} as const;

export default {
	[Routes.Pages.Home]: Home,
	[Routes.Pages.Clock(":auctionId" as any)]: Clock,
	[Routes.Pages.Auctions.Base]: Auctions,
	[Routes.Pages.Auctions.Pending]: PendingAuction,
	[Routes.Pages.Profile(":userId" as any)]: Profile,
	[Routes.Pages.Auctions.Create]: CreateAuction,
	[Routes.Pages.Auctions.Items]: CreateAuctionItem,
	[Routes.Pages.CreateProduct]: CreateProduct,
	[Routes.Pages.Test]: Test,
	[Routes.Pages.Login]: Login,
	[Routes.Pages.Register]: Registration
} as { [path: string]: LazyExoticComponent<() => JSX.Element> };
