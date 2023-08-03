const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0226e3e9ea871a831248a7eed230ba2e2e5db7fc1b1c30fa450bbbd76d81d1f18b": 100,
  "03e82828af50cef5fe73be1d4b83c0cd43e42c1582190ca92d91982527e6d7dec5": 50,
  "031ff24d97a5535e01c949678708d40bdb234aee4c3cc270cdbd8411abc1ef72b1": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, r, s, recipient, amount } = req.body;
  console.log("r:", r);
  console.log("s:", s);

  const sig = new secp.secp256k1.Signature(BigInt(r), BigInt(s));

  const isVerified = secp.secp256k1.verify(sig, keccak256(utf8ToBytes("message")), sender);

  if (isVerified) {
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    alert("Address not verified");
  }



});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
