const crypto = require('crypto');

// Code comes from ECPay/ECPayAIO_Node.js
const urlencode_dot_net = (raw_data, case_tr = 'DOWN') => {
  if (typeof raw_data === 'string') {
    let encode_data = encodeURIComponent(raw_data);
    switch (case_tr) {
      case 'KEEP':
        // Do nothing
        break;
      case 'UP':
        encode_data = encode_data.toUpperCase();
        break;
      case 'DOWN':
        encode_data = encode_data.toLowerCase();
        break;
    }
    encode_data = encode_data.replace(/\'/g, '%27');
    encode_data = encode_data.replace(/\~/g, '%7e');
    encode_data = encode_data.replace(/\%20/g, '+');
    return encode_data;
  } else {
    throw new Error('Data received is not a string.');
  }
};

exports.genCheckMacValue = ({ info: params, hashKey: hkey, hashIV: hiv }) => {
  // Code comes from ECPay/ECPayAIO_Node.js
  if (typeof params === 'object') {
    // throw exception if param contains CheckMacValue, HashKey, HashIV
    let sec = ['CheckMacValue', 'HashKey', 'HashIV'];
    sec.forEach(function (pa) {
      if (Object.keys(params).includes(pa)) {
        throw new Error(`Parameters shouldn't contain ${pa}`);
      }
    });

    let od = {};
    let temp_arr = Object.keys(params).sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    // console.log(temp_arr);

    let raw = temp_arr.forEach(function (key) {
      od[key] = params[key];
    });
    raw = JSON.stringify(od).toLowerCase().replace(/":"/g, '=');
    raw = raw.replace(/","|{"|"}/g, '&');
    raw = urlencode_dot_net(`HashKey=${hkey}${raw}HashIV=${hiv}`);
    // console.log(raw);

    let chksum = crypto.createHash('sha256').update(raw).digest('hex');

    return chksum.toUpperCase();
  } else {
    throw new Error('Data received is not a Object.');
  }
};
