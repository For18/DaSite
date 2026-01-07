import { DarkTheme } from "@/themes/Dark";
import ThemeCSSProvider from "@/themes/ThemeCSSProvider";
import { useState } from "react";
import Slider from "./Slider";
import styles from "./Slider.module.scss";

function TestComponent({ onChange }) {
	const [value, setValue] = useState(0);

	return (
		<ThemeCSSProvider theme={DarkTheme}>
			<Slider min={0} max={100} value={value} step={1} onChange={v => {
				setValue(v);
				onChange(v);
			}} width="50vw"/>
		</ThemeCSSProvider>
	);
}

describe("<Slider/>", () => {
	it("renders", () => {
		cy.mount(<Slider min={0} max={100} value={50} step={1}/>);
	});

	it("dragging works"); // TODO: Implement it just won't trigger the events for some reason, pls help

	it("arrows work", () => {
		let value = 0;
		cy.mount(<TestComponent onChange={v => value = v}/>);
		cy.get(`.${styles.handle}`).trigger("keydown", { key: "ArrowRight" }).then(() => {
			expect(value).to.equal(1);
		}).trigger("keydown", { key: "ArrowUp" }).then(() => {
			expect(value).to.equal(2);
		}).trigger("keydown", { key: "ArrowLeft" }).then(() => {
			expect(value).to.equal(1);
		}).trigger("keydown", { key: "ArrowDown" }).then(() => {
			expect(value).to.equal(0);
		});
	});

	it("page up/down work", () => {
		let value = 0;
		cy.mount(<TestComponent onChange={v => value = v}/>);
		cy.get(`.${styles.handle}`).trigger("keydown", { key: "PageUp" }).then(() => {
			expect(value).to.equal(10);
		}).trigger("keydown", { key: "PageDown" }).then(() => {
			expect(value).to.equal(0);
		});
	});

	it("home/end work", () => {
		let value = 0;
		cy.mount(<TestComponent onChange={v => value = v}/>);
		cy.get(`.${styles.handle}`).trigger("keydown", { key: "Home" }).then(() => {
			expect(value).to.equal(0);
		}).trigger("keydown", { key: "End" }).then(() => {
			expect(value).to.equal(100);
		});
	});
});
