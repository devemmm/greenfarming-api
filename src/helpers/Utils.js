const moment = require("moment");

class Utils {
  constructor() {
    return this;
  }

  rightNow() {
    return moment().format("YYYY-MM-DDTHH:mm:ss");
  }
}

module.exports = Utils;
