/**
 * topicsManagement.js - Topics Configuration Loader
 * Loads topics configuration and initializes existing take cards
 */

let configData;

/**
 * Loads topics configuration from JSON file
 */
const loadConfig = async () => {
  try {
    const response = await fetch('/js/topics.json');
    configData = await response.json();

    if (typeof initExistingTakeCards === "function") {
      initExistingTakeCards();
    }

    if (typeof addTicketData === "function") {
      addTicketData();
    }
  } catch (error) {
    console.error("Error loading JSON of topics:", error);
  }
};

loadConfig();
