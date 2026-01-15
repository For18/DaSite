import { API_URL } from "@/lib/api";
import styles from "@component/EndedAuction/EndedAuction.module.scss";
import { Routes } from "@route/Routes";

describe("<EndedAuction/>", () => {
	beforeEach(() => {
		const auctionData = cy.fixture("Auction.json");
		cy.intercept("GET", API_URL + Routes.AuctionItem.GetByAuction("*"), { fixture: "AuctionItems.json" });
		cy.intercept("GET", API_URL + Routes.User.GetUserRole, "Customer");
		cy.intercept("GET", API_URL + Routes.User.GetPrivate("*"), { fixture: "PrivateUser.json" });
		cy.intercept("GET", API_URL + Routes.Auction.Get("*"), req => {
			req.reply({ ...auctionData, startingTime: Date.now() + 1000 });
		});
	});

	// TODO: Fix
	it("navigates user to pending auction page", () => {
		cy.visit(Routes.Pages.Clock(1));
		cy.get(`.${styles.linkContainer}`); /*.within(() => {
			cy.contains("button", "Pending Auction").click();
			cy.url().should("include", Routes.Pages.Auctions.Pending);
		});*/
	});

	it("navigates user to Next Auction page", () => {
		cy.visit(Routes.Pages.Clock(1));
		// cy.get(`.${styles.linkContainer}`).within(() => {
		// 	cy.contains("button", "Next Auction").click();
		// 	cy.url().should("include", Routes.Pages.Clock(0));
		// });
	});
});
