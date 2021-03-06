const {Wit, log} = require('node-wit');
const logger = require("../../loggers").appLogger;
const BaseNLP = require("./base.nlp");

module.exports = class WIT extends BaseNLP {

  constructor(auth, nodes, actions) {
    super(nodes, actions);
    this.client = new Wit({
      accessToken: auth.token,
      // logger: logger // optional
    });
    this.queryResult = {};
    logger.info(`New NLP for Wit.AI created`);
  }

  async detectIntent(input, userData) {
    const that = this;
    try {
      that.queryResult = await that.client.message(input, {});
      return ('intent' in that.queryResult.entities) ? that.queryResult.entities.intent[0].value : null;
    } catch (e) {
      //TODO: Check if length of text exceeds 256
      //TODO: Retry 3 times
      throw e;
    }
  }
};