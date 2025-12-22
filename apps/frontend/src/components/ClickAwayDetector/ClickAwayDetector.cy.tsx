import ClickAwayDetector from "../ClickAwayDetector";

describe("<ClickAwayDetector/>", () => {
	it("should work", () => {
		let triggered = false;
		cy.mount(<ClickAwayDetector onClickAway={() => triggered = true}>
			<div style={{
				width: "100px",
				height: "100px"
			}}/>
		</ClickAwayDetector>);
		cy.wrap(document.body).click().then(() => {
			expect(triggered).to.be.true;
		});
	});
});
