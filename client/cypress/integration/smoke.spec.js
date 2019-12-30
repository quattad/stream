import { italic } from "ansi-colors";

describe('Smoke test', () => {
    it('Makes sure Learn React test is present', () => {
        cy.visit('http://localhost:3000')
            .contains('Learn React')
    });
});