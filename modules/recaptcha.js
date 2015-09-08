var https = require('https');
var config = require('../config/recaptcha.js');

module.exports = {
    verify: function( response, callback ){
        https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + config.secret +
                  "&response=" + response,
                  function(res) {
                      var data = "";
                      res.on('data', function (chunk) {
                          data += chunk.toString();
                      });
                      res.on('end', function() {
                          try {
                              var parsedData = JSON.parse(data);                              
                              callback(null, parsedData.success);
                          } catch (e) {
                              callback(e, false);
                          }
                      });
                  });
    }
};
