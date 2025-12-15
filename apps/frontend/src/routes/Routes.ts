import { type JSX, lazy, type LazyExoticComponent } from "react";

const Home = lazy(() => import("./Home"));
const Clock = lazy(() => import("./ClockPage"));
const Auctions = lazy(() => import("./Auctions"));
const PendingAuction = lazy(() => import("./PendingAuction"));
const Profile = lazy(() => import("./Profile"));
const CreateProduct = lazy(() => import("./CreateProductPage"));
const Test = lazy(() => import("./Test"));
const CreateAuction = lazy(() => import("./CreateAuction"));

export default {
	"/": Home,
	"/clock/:auctionId": Clock,
	"/auctions": Auctions,
	"/auctions/pending": PendingAuction,
	"/profile/:userId": Profile,
  "/auctions/create": CreateAuction,
	"/create-product": CreateProduct,
	"/test": Test
} as { [path: string]: LazyExoticComponent<() => JSX.Element> };

export const Routes = {
  User: {
    GetPublic:        (id: number | string) => `/user/${id}`,
    GetPrivate:       (id: number | string) => `/user/private/${id}`,
    GetAllPrivate:    `/user/users/private`,
    GetAllPublic:     `/users`,
    GetAllByName:     (name: string) => `/users/by-name/${name}`,
    Post:             `/user`,
    Delete:           (id: number | string) => `/user/${id}`,
    Patch:            (id: number | string) => `/user/${id}`,
  },

  Sale: {
    Get:             (id: number | string) => `/sale/${id}`,
    GetByAuction:    (auctionId: number | string) => `/sale/by-auction/${auctionId}`,
    GetAll:          `/sales`,
    Post:            `/sale`,
    Delete:          (id: number | string) => `/sale/${id}`,
    Patch:           (id: number | string) => `/sale/${id}`,
  },

  ProductImage: {
    Get:             (id: number | string) => `/product-image/${id}`,
    FromParent:      (parentId: number | string) => `/product-image/from/${parentId}`,
    Post:            `/product-image`,
    BatchPost:       `/product-image/batch`,
    Delete:          (id: number | string) => `/product-image/${id}`,
    Patch:           (id: number | string) => `/product-image/${id}`,
  },

  Product: {
    Get:             (id: number | string) => `/product/${id}`,
    GetAll:          `/products`,
    GetOfUser:       (userId: number | string) => `/products/user/${userId}`,
    GetContainedIn:  (ids: (number | string)[]) =>
                        `/batch?${ids.map(id => `ids=${id}`).join("&")}`,
    Post:            `/product`,
    Delete:          (id: number | string) => `/product/${id}`,
    Patch:           (id: number | string) => `/product/${id}`,
  },

  AuctionItem: {
    GetAll:          `/auction-item/all`,
    Get:             (id: number | string) => `/auction-item/${id}`,
    BatchGet:        `/auction-items/batch`,
    GetByAuction:    (auctionId: number | string) => `/auction-item/by-auction/${auctionId}`,
    Post:            `/auction-item`,
    BatchPost:       `/auction-item/batch`,
    Delete:          (id: number | string) => `/auction-item/${id}`,
    Patch:           (id: number | string) => `/auction-item/${id}`,
  },

  AuctionEntry: {
    Get:             (auctionId: number | string) => `/auction-entry/${auctionId}`,
    GetBatch:        `/auction-entries/batch`,
    GetFromAuction:  (auctionId: number | string) => `/auction-entry/from-auction/${auctionId}`,
    GetFromItem:     (itemId: number | string) => `/auction-entry/from-item/${itemId}`,
    Post:            `/auction-entry`,
    BatchPost:       `/auction-entries/batch`,
    Delete:          (auctionId: number | string, itemId: number | string) => `/auction-entry/${auctionId}/${itemId}`,
    BatchDelete:     `/auction-entries/batch`,
    Patch:           (id: number | string) => `/auction-entry/${id}`,
  },

  Auction: {
    Get:             (id: number | string) => `/auction/${id}`,
    BatchGet:        `/auctions/batch`,
    GetAll:          `/auctions`,
    GetUpcoming:     `/auctions/upcoming`,
    Post:            `/auction`,
    BatchPost:       `/auctions/batch`,
    Delete:          (id: number | string) => `/auction/${id}`,
    BatchDelete:     `/auctions/batch`,
    Patch:           (id: number | string) => `/auction/${id}`,
  },
} as const;
