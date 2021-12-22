import configData from "config.json";

const Helper = {
  _randomstring(length, hasCharacters = true) {
    var result = "";
    var characters = "0123456789";
    if (hasCharacters) {
      characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  getRandomSGTIN() {
    return "0" + this._randomstring(12, false) + "9" + this._randomstring(11, true);
    // return this._randomstring(3, false);
  },

  _removeDomainProtocol(domain) {
    if (domain.includes("https://")) {
      domain = domain.replace("https://", "");
    } else if (domain.includes("http://")) {
      domain = domain.replace("http://", "");
    }
    if (domain.slice(domain.length - 1) === "/") {
      domain = domain.slice(0, -1);
    }
    return domain;
  },

  isColumnAlwaysVisible(column) {
    var columnsVisible = ["brand", "environment", "domain"];
    if (columnsVisible.indexOf(column) !== -1) {
      return true;
    }
    return false;
  },

  getDBNameFromDisplayName(displayName) {
    var columns = configData.columnsName;
    for (var i = 0; i < columns.length; i++) {
      if (columns[i].columnNameToDisplay === displayName) {
        return columns[i].columnNameDB;
      }
    }
  },

  getDisplayNameFromDBName(fieldDBName) {
    var columns = configData.columnsName;
    for (var i = 0; i < columns.length; i++) {
      if (columns[i].columnNameDB === fieldDBName) {
        return columns[i].columnNameToDisplay;
      }
    }
  },

  dynamicSort(property) {
    console.log("sorting", property);
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result;
      if (
        !Object.prototype.hasOwnProperty.call(a, property) &&
        !Object.prototype.hasOwnProperty.call(b, property)
      ) {
        return 0;
      }
      if (!Object.prototype.hasOwnProperty.call(a, property)) {
        result = -1;
      } else if (!Object.prototype.hasOwnProperty.call(b, property)) {
        result = 1;
      } else {
        result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      }

      return result * sortOrder;
    };
  },
};

export default Helper;
