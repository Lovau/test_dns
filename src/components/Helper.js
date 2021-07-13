const Helper = {

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
  	return domain;
  }
};

export default Helper;
