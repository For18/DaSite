import Throbber from "./Throbber";
import styles from "./Throbber.module.scss";

describe("<Throbber/>", () => {
	it("renders", () => {
		cy.mount(<Throbber/>);
	});

	it("throbs", () => {
		cy.mount(<Throbber/>);
		cy.get(`.${styles.dot}`).each($dot => {
			cy.wrap($dot).should("have.css", "transform");

			const prevTransform = $dot.css("transform");
			cy.wait(100).then(() => {
				cy.wrap($dot).should("not.have.css", "transform", prevTransform);
			});
		});
	});
});
