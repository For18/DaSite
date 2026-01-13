import Image from "./Image";

const TEST_ALT = "Test Image Alt Text";
const TEST_CORRECT_SRC = "https://uhf.microsoft.com/images/microsoft/RE1Mu3b.png";
const TEST_INCORRECT_SRC = "https://example.com/nonexistent-image.jpg";

describe("<Image/>", () => {
	it("renders", () => {
		cy.mount(<Image alt={TEST_ALT} src={TEST_CORRECT_SRC}/>);
	});

	it("has alt", () => {
		cy.mount(<Image alt={TEST_ALT} src={TEST_CORRECT_SRC}/>);
		cy.get("img").should("have.attr", "alt", TEST_ALT);
	});

	it("has src", () => {
		cy.mount(<Image alt={TEST_ALT} src={TEST_CORRECT_SRC}/>);
		cy.wait(100); // Assert after possible fallback trigger
		cy.get("img").should("have.attr", "src", TEST_CORRECT_SRC);
	});

	it("falls back to next image on error", () => {
		cy.mount(
			<Image alt={TEST_ALT} src={[TEST_INCORRECT_SRC, TEST_CORRECT_SRC]}/>
		);
		cy.wait(100); // Assert after fallback trigger
		cy.get("img").should("have.attr", "src", TEST_CORRECT_SRC);
	});

	it("uses placeholder if all images fail", () => {
		cy.mount(<Image alt={TEST_ALT} src={TEST_INCORRECT_SRC}/>);
		cy.wait(100); // Assert after fallback trigger
		cy.get("img").and($img => {
			expect($img[0].src).to.contain("https://placehold.co/");
		});
	});
});
