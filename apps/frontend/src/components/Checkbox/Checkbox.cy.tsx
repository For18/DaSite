import Checkbox from "../Checkbox";

describe("<Checkbox/>", () => {
	it("renders", () => {
		cy.mount(<Checkbox checked={false} onClick={() => {}}/>);
	});

	it("can be toggled", () => {
		let value = false;
		cy.mount(<Checkbox checked={value} onClick={() => value = !value}/>);
		cy.get("[role=checkbox]").click().then(() => {
			expect(value).to.be.true;
		});
	});
});
