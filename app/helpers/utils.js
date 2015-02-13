var asyncReplace = require('async-replace');

exports.randomString = function(len, callback) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
      var randomInt = 'Abcd1234';
      var clen = (charlen - 1);
      getRandomInt(0, clen, function(rdStr){
          randomInt = rdStr;
      });
    buf.push(chars[randomInt]);
  }

  callback(buf.join(''));
};

function getRandomInt(min, max, callback) {
  var mathMak = Math.floor(Math.random() * (max - min + 1)) + min;
  callback(mathMak);
}

exports.findQueryString = function(str, callback){
    var splChars = "?";
    var bool = false;
    for (var i = 0; i < str.length; i++) {
        if (splChars.indexOf(str.charAt(i)) != -1){
            bool = true;            
        }
        if(bool){
            break;
        }
    }
    callback(bool);
}

exports.in_array = function(needle, haystack, argStrict, callback) {
  
  // *     example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
  // *     returns 1: true
  // *     example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
  // *     returns 2: false
  // *     example 3: in_array(1, ['1', '2', '3']);
  // *     returns 3: true
  // *     example 3: in_array(1, ['1', '2', '3'], false);
  // *     returns 3: true
  // *     example 4: in_array(1, ['1', '2', '3'], true);
  // *     returns 4: false
  var key = '',
    strict = !! argStrict;
    
  var bool = false;

  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        bool = true;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        bool = true;
      }
    }
  }

  callback(bool);
}

exports.imgExt = ['JPG', 'JPEG', 'GIF', 'PNG', 'TIFF', 'jpg', 'jpeg', 'gif', 'png', 'tiff'];

/*exports.mysql_real_escape_string = function(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}





exports.mysql_real_escape_string = function(str, callback) {
    var returnStr = str.replace(/[\0]/g, "\\0");
    returnStr = returnStr.replace(/[\x08]/g, "\\b");
    returnStr = returnStr.replace(/[\x09]/g, "\\t");
    returnStr = returnStr.replace(/[\x1a]/g, "\\z");
    returnStr = returnStr.replace(/[\n]/g, "\\n");
    returnStr = returnStr.replace(/[\r]/g, "\\r");
    returnStr = returnStr.replace(/"/g, '\"');
    returnStr = returnStr.replace(/'/g, "\'");
    returnStr = returnStr.replace(/[\\]/g, "\\\\");
    returnStr = returnStr.replace(/[\%]/g, "\\%");
    callback(returnStr);    
}


function replacer(match, p1, p2, offset, input, done){
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    switch (match) {
            case "\0":
                done(null,"\\0");
            case "\x08":
                done(null,"\\b");
            case "\x09":
                done(null,"\\t");
            case "\x1a":
                done(null,"\\z");
            case "\n":
                done(null,"\\n");
            case "\r":
                done(null,"\\r");
            case "\"":
            case "'":
            case "\\":
            case "%":
                done(null,"\\"+match); // prepends a backslash to backslash, percent,
                                  // and double/single quotes
            
        }
};*/

exports.mysql_real_escape_string = function(str, callback2) {
    
    /*asyncReplace(str, /[\0\x08\x09\x1a\n\r"'\\\%]/g, (match, p1, p2, offset, input, callback) {
    }, function(err, result) {
        callback(result); // will print 'abc - 12345 - #$*%';
    });*/
    asyncReplace(str, /[\0\x08\x09\x1a\n\r"'\\\%]/g, function(match, p1, p2, offset, input, callback) {
        var returnMatch = '';
        switch (match) {
              case "\0":
                  returnMatch = "\\0";
              case "\x08":
                  returnMatch = "\\b";
              case "\x09":
                  returnMatch = "\\t";
              case "\x1a":
                  returnMatch = "\\z";
              case "\n":
                  returnMatch = "\\n";
              case "\r":
                  returnMatch = "\\r";
              case "\"":
              case "'":
              case "\\":
              case "%":
                  returnMatch = "\\"+match; // prepends a backslash to backslash, percent,
                                    // and double/single quotes

          }
          callback(null, returnMatch);
    }, function(err, result){
        callback2(result);
    });
    
}

exports.mysql_real_escape_string = function(str, callback) {
    var returnVal = str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
    callback(returnVal);
}