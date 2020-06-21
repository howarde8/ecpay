import {
  getUrlEncodeDotNet,
  getConcatParamsStr,
  getCheckMacValue,
} from '../utils';

test('[getUrlEncodeDotNet] English and signs', () => {
  // Alphabets and numbers
  expect(
    getUrlEncodeDotNet(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    )
  ).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');

  // General signs in ASCII
  // Check the mapping table from 綠界 - https://www.ecpay.com.tw/CascadeFAQ/CascadeFAQ_Qa?nID=1197
  expect(getUrlEncodeDotNet(` !"#$%&'()*+,-./:;<=>?@[\\]^_\`~`)).toBe(
    `+!%22%23%24%25%26%27()*%2B%2C-.%2F%3A%3B%3C%3D%3E%3F%40%5B%5C%5D%5E_%60%7E`
  );
});

const EXAMPLE_PARAMS = {
  MerchantID: '2000132',
  MerchantTradeNo: 'ecpay20130312153023',
  MerchantTradeDate: '2013/03/12 15:30:23',
  PaymentType: 'aio',
  TotalAmount: 1000,
  TradeDesc: '促銷方案',
  ItemName: 'Apple iphone 7 手機殼',
  ReturnURL: 'https://www.ecpay.com.tw/receive.php',
  ChoosePayment: 'ALL',
  EncryptType: 1,
};
const EXAMPLE_HKEY = '5294y06JbISpM5x9';
const EXAMPLE_HIV = 'v77hoKGq4kWxNNIS';

test('[genCheckMacValue] Official example', () => {
  expect(getConcatParamsStr(EXAMPLE_PARAMS)).toBe(
    'ChoosePayment=ALL&EncryptType=1&ItemName=Apple iphone 7 手機殼&MerchantID=2000132&MerchantTradeDate=2013/03/12 15:30:23&MerchantTradeNo=ecpay20130312153023&PaymentType=aio&ReturnURL=https://www.ecpay.com.tw/receive.php&TotalAmount=1000&TradeDesc=促銷方案'
  );

  expect(
    getCheckMacValue({
      params: EXAMPLE_PARAMS,
      hkey: EXAMPLE_HKEY,
      hiv: EXAMPLE_HIV,
    })
  ).toBe('CFA9BDE377361FBDD8F160274930E815D1A8A2E3E80CE7D404C45FC9A0A1E407');
});

test('[genCheckMacValue] Contains CheckMacValue, hkey or hiv', () => {
  expect(() => {
    getCheckMacValue({
      params: { ...EXAMPLE_PARAMS, CheckMacValue: 'Something...' },
      hkey: EXAMPLE_HKEY,
      hiv: EXAMPLE_HIV,
    });
  }).toThrow();

  expect(() => {
    getCheckMacValue({
      params: { ...EXAMPLE_PARAMS, HashKey: 'Something...' },
      hkey: EXAMPLE_HKEY,
      hiv: EXAMPLE_HIV,
    });
  }).toThrow();

  expect(() => {
    getCheckMacValue({
      params: { ...EXAMPLE_PARAMS, HashIV: 'Something...' },
      hkey: EXAMPLE_HKEY,
      hiv: EXAMPLE_HIV,
    });
  }).toThrow();
});
