import Input from "./Input";

describe("<Input/>", () => {
	it("renders", () => {
		cy.mount(<Input type="text"/>);
	});

	it("can be typed in", () => {
		const testValue = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let value = "";
		cy.mount(<Input value={value} onChange={v => value += v}/>);
		cy.get("input").type(testValue).then(() => {
			expect(value).to.equal(testValue);
		});
	});

	it("can be disabled", () => {
		cy.mount(<Input disabled/>);
		cy.get("input").should("be.disabled");
	});
});