import { useState } from "react";
import server from "./server";
import * as keccak from 'ethereum-cryptography/keccak'
import { utf8ToBytes } from 'ethereum-cryptography/utils'
import * as secp from 'ethereum-cryptography/secp256k1'


function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const sign = secp.secp256k1.sign(keccak.keccak256(utf8ToBytes("message")), privateKey);
    console.log("sig, ", sign)
    const r = sign.r.toString()
    const s = sign.s.toString()

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        r: r,
        s: s,
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex)
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
