import crypto from 'crypto';

export const getUrlEncodeDotNet = (str: string) => {
  // List the difference between .Net and general URI Encoded format
  const URI_ENCODE_TO_DOT_NET: { [key: string]: string } = {
    '%20': '+',
    "'": '%27',
    '~': '%7E',
  };

  let uriEncodedStr: string = encodeURIComponent(str);
  Object.keys(URI_ENCODE_TO_DOT_NET).map((key) => {
    uriEncodedStr = uriEncodedStr.replace(
      new RegExp(key, 'g'),
      URI_ENCODE_TO_DOT_NET[key]
    );
  });

  return uriEncodedStr;
};

export const getConcatParamsStr = (params: { [key: string]: any }) => {
  return Object.keys(params)
    .sort((a, b) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()))
    .map((key) => `${key}=${params[key]}`)
    .join('&');
};

export const getCheckMacValue = ({
  params,
  hkey,
  hiv,
}: {
  params: { [key: string]: any };
  hkey: string;
  hiv: string;
}) => {
  // Check if params contains the following keys
  ['CheckMacValue', 'HashKey', 'HashIV'].forEach((key) => {
    if (params[key]) throw Error(`Params cannot contains ${key}`);
  });

  let res = getUrlEncodeDotNet(
    `HashKey=${hkey}&${getConcatParamsStr(params)}&HashIV=${hiv}`
  );
  res = res.toLocaleLowerCase();
  res = crypto.createHash('sha256').update(res).digest('hex');
  res = res.toLocaleUpperCase();

  return res;
};
