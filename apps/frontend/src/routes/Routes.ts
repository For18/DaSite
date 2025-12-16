import { type JSX, lazy, type LazyExoticComponent } from "react";

const Home = lazy(() => import("./Home"));
const Clock = lazy(() => import("./ClockPage"));
const Auctions = lazy(() => import("./Auctions"));
const PendingAuction = lazy(() => import("./PendingAuction"));
const Profile = lazy(() => import("./Profile"));
const CreateProduct = lazy(() => import("./CreateProductPage"));
const Test = lazy(() => import("./Test"));
const CreateAuction = lazy(() => import("./CreateAuction"));
const Login = lazy(() => import("./Login"));
const Registration = lazy(() => import("./Registration"));

export default {
	"/": Home,
	"/clock/:auctionId": Clock,
	"/auctions": Auctions,
	"/auctions/pending": PendingAuction,
	"/profile/:userId": Profile,
	"/auctions/create": CreateAuction,
	"/products/create": CreateProduct,
	"/test": Test,
	"/login": Login,
	"/register": Registration
} as { [path: string]: LazyExoticComponent<() => JSX.Element> };

export const Routes = {
  Pages: {
    Home:             `/`,
    Clock:            (id: number | string) => `/clock/${id}`,
    Auctions: {
      Base:           `/auctions`,
      Create:         `/auctions/create`,
      Pending:        `/auctions/pending`,
    },
    CreateProduct:    `/products/create`,
    Profile:          (id: number | string) => `/profile/${id}`,
    Test:             `/test`,
    Login:            `/Login`,
    Register:         `/register`,
  },
  User: {
    GetPublic:        (id: number | string) => `/user/${id}`,
    GetPrivate:       (id: number | string) => `/user/private/${id}`,
    GetAllPrivate:    `/user/users/private`,
    GetAllPublic:     `/users`,
    GetAllByName:     (name: string) => `/users/by-name/${name}`,
    GetCurrent:       `/private/current`,
    Post:             `/user`,
    Delete:           (id: number | string) => `/user/${id}`,
    Patch:            (id: number | string) => `/user/${id}`,
  },

  Sale: {
    Get:             (id: number | string) => `/sale/${id}`,
    GetByAuction:    (auctionId: number | string) => `/sale/by-auction/${auctionId}`,
    GetAll:          `/sales`,
    GetBatch:        `/sales/batch`,
    Post:            `/sale`,
    PostBatch:       `/sales/batch`,
    Delete:          (id: number | string) => `/sale/${id}`,
    DeleteSale:      `/sales/delete`,
    Patch:           (id: number | string) => `/sale/${id}`,
  },

  ProductImage: {
    Get:             (id: number | string) => `/product-image/${id}`,
    FromParent:      (parentId: number | string) => `/product-image/from/${parentId}`,
    BatchGet:        `/product-image/batch`,
    Post:            `/product-image`,
    BatchPost:       `/product-image/batch`,
    Delete:          (id: number | string) => `/product-image/${id}`,
    BatchDelete:     `/product-image/batch`,
    Patch:           (id: number | string) => `/product-image/${id}`,
  },

  Product: {
    Get:             (id: number | string) => `/product/${id}`,
    GetAll:          `/products`,
    GetOfUser:       (userId: number | string) => `/products/user/${userId}`,
    GetContainedIn:  (ids: (number | string)[]) =>
                        `/batch?${ids.map(id => `ids=${id}`).join("&")}`,
    BatchGet:        `/products/batch`,
    Post:            `/product`,
    BatchPost:       `/product/batch`,
    Delete:          (id: number | string) => `/product/${id}`,
    BatchDelete:     `/products/batch`,
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
    BatchDelete:     `/auction-item/batch`,
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
  Identity: {
    PostRegister:    `/identity/register`,
    PostLogin:       `/identity/login`,
    PostRefresh:     `/identity/refresh`,
    GetConfirmEmail: `/identity/confirmEmail`,
    PostResendConfirmEmail: `/identity/resendConfirmEmail`,
    PostForgotPassword: `/identity/forgotPassword`,
    PostResetPassword: `/identity/resetPassword`,
    PostManage2fa:       `/identity/manage/2fa`,
    GetManageInfo:   `/identity/manage/info`,
    PostManageInfo:  `/identity/manage/info`,
  },
} as const;
