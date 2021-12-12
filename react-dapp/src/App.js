import './App.css';
import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/token.sol/Token.json'

const greeterAddress = "0xA0D8e657c03CeDDeE7d2d1eC506CCa200690c2bE"
const tokenAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"

function App() {
  const [greeting, setGreetingValue] = useState(' ')
  const [userAccount, setUserAccount] = useState(' ')
  const [amount, setAmount] = useState(0)
  
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts'});
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      try {
          const data = await contract.greet()
          console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      const balance = await contract.balanceOf (account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function setGreeting() {
      if (!greeting) return
      if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
        const transaction = await contract.setGreeting(greeting)
        setGreetingValue('')
        await transaction.wait()
        fetchGreeting()
      }
    } 

   async function sendCoins(){
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input 
          onChange={e => setGreetingValue(e.target.value)}
          placeholder="Set Greeting"
          value={greeting}
        />
        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      </header>
    </div>
  );
}

export default App;
