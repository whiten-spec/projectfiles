const AES = require("crypto-js/aes");
const ECB = require("crypto-js/mode-ecb")
// var Base64 = require('crypto-js/enc-base64');
const Utf8 = require('crypto-js/enc-utf8');
const Pkcs7 = require('crypto-js/pad-pkcs7');

export function encrypt(text: any ) {
    const key1 = "GS", key2 = "010", key3 = "volunteer", key4 = "21";
    const key = Utf8.parse(key1 + key2 + key3 + key4);
    const encryptedData = AES.encrypt(text, key, {
        mode: ECB,
        padding: Pkcs7,
    });
    return encryptedData.toString();
}
