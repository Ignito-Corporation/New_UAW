import {JSHmac, CONSTANTS} from 'react-native-hash';

global.generateTimeStamp = function generateTimeStamp() {
  //10 Digit
  var timeStamp = Math.round(new Date().getTime() / 1000);
  //13 Digit
  //var timeStamp = Date.now();
  return timeStamp;
};

global.generateHash = function generateHash(method) {
  const Secret_Key = 'abs@2021';
  const Key = 'abcd1234';
  var timeStamp = global.generateTimeStamp();

  var toEncrypt = '{"method":"' + method + Key + timeStamp;

  JSHmac(toEncrypt, Secret_Key, CONSTANTS.HmacAlgorithms.HmacSHA256)
    .then(hash => {
      return hash;
    })
    .catch(e => console.log(e));
};
