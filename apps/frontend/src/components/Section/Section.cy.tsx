import Section from "./Section";

describe("<Section/>", () => {
	it("renders", () => {
		cy.mount(<Section/>);
	});

	it("renders children", () => {
		cy.mount(
			<Section>
				<div data-test="child">test</div>
			</Section>
		);

		cy.get("[data-test=child]").should("contain.text", "test");
	});

	it("applies flex props when flex is given", () => {
		cy.mount(
			<Section flex={{
				direction: "row",
				justify: "center",
				align: "center",
				wrap: "wrap"
			}}/>
		);

		cy.get("section").should("have.css", "display", "flex")
			.and("have.css", "flex-direction", "row")
			.and("have.css", "justify-content", "center")
			.and("have.css", "align-items", "center")
			.and("have.css", "flex-wrap", "wrap");
	});

	it("apply className when prop is given", () => {
		cy.mount(
			<Section className="test-name"/>
		);

		cy.get("section").should("have.class", "test-name");
	});
});
