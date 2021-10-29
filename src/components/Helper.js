const Helper = {

  isAdmin(location) {
    //destructuring pathname from location
    const { pathname } = location;
    
    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/");
    if (splitLocation[1] === "isadmin") {
      return true;
    }
    return false;
  },

  _randomstring(length, hasCharacters = true) {
      var result           = '';
      var characters       = '0123456789';
      if (hasCharacters) {
      	characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      }
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  },

  getEnvironmentList() {
    return [
      "RC",
      "Staging",
      "Prod Tech",
      "Public prod",
    ];
  },

  getRandomSGTIN() {
  	// return '0' + this._randomstring(12, false) + '9' + this._randomstring(11, true);
  	return this._randomstring(3, false);
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

  //mapping: columnNameInDB => column name displayed
  getColumnsNames() {
    return [
      { 
        "columnNameDB": "brand",
        "columnNameToDisplay": "Brand"
      },
      { 
        "columnNameDB": "environment",
        "columnNameToDisplay": "Environment"
      },
      { 
        "columnNameDB": "domain",
        "columnNameToDisplay": "URL"
      },
      { 
        "columnNameDB": "live",
        "columnNameToDisplay": "Live"
      },
      { 
        "columnNameDB": "comment",
        "columnNameToDisplay": "Comment"
      },
      { 
        "columnNameDB": "updated",
        "columnNameToDisplay": "Last update"
      }
    ];
  },

  isColumnAlwaysVisible(column) {
    var columnsVisible = [
      "brand",
      "environment",
      "domain",
    ];
    if (columnsVisible.indexOf(column) !== -1) {
      return true;
    }
    return false;
  },

  getDBNameFromDisplayName(displayName) {
    var columns = this.getColumnsNames();
    for (var i = 0; i < columns.length; i++) {
      if (columns[i].columnNameToDisplay === displayName) {
        return columns[i].columnNameDB;
      }
    }
  },

  getDisplayNameFromDBName(fieldDBName) {
    var columns = this.getColumnsNames();
    for (var i = 0; i < columns.length; i++) {
      if (columns[i].columnNameDB === fieldDBName) {
        return columns[i].columnNameToDisplay;
      }
    }
  }
};

export default Helper;
