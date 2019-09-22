// This is an example of an e2e / feature test

describe('adding a restaurant', () => {
    it('displays restaurant in list', () => {
        const restaurantName = 'Sushi Place'

        cy.visit('localhost:3000');

        cy.get('[data-test="addRestaurantButton"]')
            .click();

        cy.get('[data-test="addRestaurantName"]')
            .type('New Message');

        cy.get('[data-test="saveNewRestaurantButton"]')
            .click();

        cy.contains(restaurantName)
    });
});