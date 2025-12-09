import {createElement} from 'react'
import Button from './Button'

describe('<Button/>', () => {
  it('renders', () => {
    cy.mount(<Button/>);
  })

  it("can be clicked", () => {
	let triggered = false;
	cy.mount(<Button onClick={() => triggered = true}/>);
	cy.get("button").click().then(() => {
		expect(triggered).to.be.true;
	});
  })

  it("can be disabled", () => {
	cy.mount(<Button disabled/>);
	cy.get("button").should("be.disabled");
  })
})