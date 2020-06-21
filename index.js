const request = require('request');
const moment = require('moment');
const { genCheckMacValue } = require('./utils');

// Get hash key and hash iv from ECPAY
const HASH_KEY = '5294y06JbISpM5x9';
const HASH_IV = 'v77hoKGq4kWxNNIS';

const newOrder = {
  MerchantID: '2000132',
  MerchantTradeNo: 'testTradeNumber123',
  MerchantTradeDate: moment().format('YYYY/MM/DD HH:mm:ss'),
  PaymentType: 'aio',
  TotalAmount: 5000,
  TradeDesc: '商城購物',
  ItemName: '商品',
  ReturnURL: 'http://localhost:5000',
  ClientRedirectURL: 'http://localhost:5000',
  ChoosePayment: 'ALL',
  EncryptType: 1,
};

const CheckMacValue = genCheckMacValue({
  info: newOrder,
  hashKey: HASH_KEY,
  hashIV: HASH_IV,
});
console.log(CheckMacValue);

request(
  {
    method: 'post',
    url: 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
    formData: { ...newOrder, CheckMacValue },
  },
  (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  }
);
