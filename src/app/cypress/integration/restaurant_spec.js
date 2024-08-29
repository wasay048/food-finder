describe("Restaurant Search", () => {
  it("should display user location on map", () => {
    cy.visit("/");
    cy.get(".map-container").should("exist");
  });

  it("should display restaurants based on location", () => {
    cy.visit("/");
    cy.get("button").contains("Find Restaurants").click();
    cy.get(".restaurant-card").should("have.length.greaterThan", 0);
  });
});
