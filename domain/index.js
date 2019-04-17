const logger = require("../loggers").appLogger;
const PharmacyModel = require("./models/pharmacy.model");

const xo = new VriskoScraperService();

module.exports = {
  actions: {
    exampleAction: async function (userData, botResponses) {
      // Do something asynchronously (for consistency)
    },
    showVerticalListOfNearestPharmacies: async function(userData, botResponses) {

      let pharmacies = [];
      try {
        const now = new Date();
        logger.debug(`Looking for pharmacies at ${now.toISOString()}`);
        pharmacies = await PharmacyModel.findNearestOpenPharmacies(
          userData.domainData.locationInCoordinates.latitude,
          userData.domainData.locationInCoordinates.longitude,
          now,
          10);
      } catch(e) {
        throw e;
      }

      if (pharmacies && pharmacies.length) {
        logger.debug(`Found ${pharmacies.length} open pharmacies.`);

        botResponses.push({
          type: 'text',
          options: [
            `Τα ${pharmacies.length} κοντινότερα φαρμακεία είναι:`
          ]
        });

        let warning = ``;

        botResponses.push({
          type: "cardslist",
          representation: "horizontal",
          cards: pharmacies.map((pharmacy) => {
            if (pharmacy.distance > 10000) warning = `⚠`;
            else warning = ``;
            return {
              type: "card",
              title: pharmacy.name,
              subtitle: `${pharmacy.address}\nΑπόσταση: ${Math.round(pharmacy.distance)}μ. ${warning}\n${pharmacy.workingHours}`,
              buttons: [{
                type: 'url',
                title: "📍 Google Maps",
                payload: `https://maps.google.com/?ll=${pharmacy.location.coordinates[1]},${pharmacy.location.coordinates[0]}`
              },{
                type: 'phone',
                title: `☎ ${pharmacy.phone}`,
                payload: `+30${pharmacy.phone}`
              }]
            }
          })
        });
      } else {

        botResponses.push({
          type: 'text',
          options: [
            "Δυστυχώς δεν βρέθηκαν αποτελέσματα :(",
            "Κάτι πήγε στραβά και δεν βρέθηκαν αποτελέσματα :("
          ]
        });
      }

    }
  },
};