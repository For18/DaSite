import Switch from "./Switch";

describe("<Switch/>", () => {
	it("renders", () => {
		cy.mount(<Switch enabled={true} onClick={() => {}}/>);
	});

	it("sets enabled as aria-checked", () => {
		cy.mount(<Switch enabled={false} onClick={() => {}}/>);

		cy.get('[role="switch"]').should("have.attr", "aria-checked", "false");
	});

	it("calls onClick() on enter and space", () => {
		const onClick = cy.stub();
		let clicked = false;

		cy.mount(<Switch enabled={true} onClick={() => clicked = true}/>);

		cy.get('[role="switch"]').type("{enter}").then(() => {
			expect(clicked).to.be.true;
		});
		clicked = false;

		cy.get('[role="switch"]').type(" ").then(() => {
			expect(clicked).to.be.true;
		});
		clicked = false;
	});

	it("doesn't apply enabled class when not enabled", () => {
		cy.mount(<Switch enabled={false} onClick={() => {}}/>);

		cy.get('[role="switch"]').should("not.have.class", "styles.enabled");
	});
});
