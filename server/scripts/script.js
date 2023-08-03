const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privatekey = secp.secp256k1.utils.randomPrivateKey();
const publickey = secp.secp256k1.getPublicKey(privatekey)

console.log("public key:", toHex(publickey));
console.log("private key:", toHex(privatekey));



