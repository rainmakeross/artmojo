/**
 * @param int pad length
 * @param string pad string [optional = " "]
 * @param int pad type [optional = 'PAD_RIGHT']
 * @return string padded string
 */
String.prototype.strpad = function str_pad(pad_length, pad_string, pad_type) {
	input = this;
	if(pad_type == undefined) pad_type = 'PAD_RIGHT';
	if(pad_string == undefined) pad_string = ' ';
	switch(pad_type) {
		case 'PAD_RIGHT':
			if(input.length > pad_length) return input;
			fillnum = pad_length - input.length;
			fillstring = new Array(fillnum + 1).join(pad_string).substr(0, fillnum);
			return input + fillstring;
		break;
		case 'PAD_LEFT':
			if(input.length > pad_length) return input;
			fillnum = pad_length - input.length;
			fillstring = new Array(fillnum + 1).join(pad_string).substr(0, fillnum);
			return fillstring + input;
		break;
		case 'PAD_ALL':
			if(input.length > pad_length) return input;
			fillnum = pad_length - input.length;
			fillnum_right = Math.ceil(fillnum / 2);
			fillnum_left = Math.floor(fillnum / 2);
			fillstring_left = new Array(fillnum_left + 1).join(pad_string).substr(0, fillnum_left);
			fillstring_right = new Array(fillnum_right + 1).join(pad_string).substr(0, fillnum_right);
			return fillstring_left + input + fillstring_right;
		break;
	}
}

/**
 * Function is equivalent of PHP function http://php.net/manual/en/function.str-pad.php
 * @param string input string
 * @param int pad length
 * @param string pad string [optional = " "]
 * @param int pad type [optional = 'PAD_RIGHT']
 * @return string padded string
 */
exports.str_pad = function(input, pad_length, pad_string, pad_type, callback) {
	callback(input.strpad(pad_length, pad_string, pad_type));
}

/**
 * Function trims a string from front and end.
 */

exports.str_trim = function(str, callback){
    callback(str.replace(/^\s+|\s+$/g, ""));
}