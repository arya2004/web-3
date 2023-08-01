import { ethers } from "./ethers-5.6.esm.min.js"
import { contractAddress,  abi } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const withdrawButton = document.getElementById("withdrawButton")
const fundButton = document.getElementById("fund")
const ballanceButton = document.getElementById("ballanceButton")


connectButton.onclick = connect
withdrawButton.onclick = withdraw
fundButton.onclick = fund
ballanceButton.onclick = getBalance
console.log(ethers);

async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" })
      } catch (error) {
        console.log(error)
      }
      connectButton.innerHTML = "Connected"
      const accounts = await ethereum.request({ method: "eth_accounts" })
      console.log(accounts)
    } else {
      connectButton.innerHTML = "Please install MetaMask"
    }
  }
  async function fund()
  { 
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funcding with ${ethAmount}`)
    if(window.ethereum)
    {
        // privider
        //signer / wallet / someone with gas

        //contract interacting with
        //ABI and address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
       //same as jsonRpcProvider
       const signer = provider.getSigner()
       console.log(signer);
       const contract = new ethers.Contract(contractAddress, abi, signer)
       try {
        const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
       console.log(transactionResponse);
       //listen for tx to be mined
       await listenForTransactionMine(transactionResponse, provider)
       console.log("DOme");
       } catch (error) {
        console.log(error);
       }
       
    }

  }

async function withdraw()
{
    if (typeof window.ethereum !== "undefined") {
      console.log("withdrawing.......");
        const provider = new ethers.providers.Web3Provider(window.ethereum) 
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse =  await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (err) {
            console.log(err);
        }
  
     } else {
       connectButton.innerHTML = "Please install MetaMask"
     }
}

function listenForTransactionMine(transactionResponse, provider)
{
    console.log(`MMining ${transactionResponse.hash}`);
    return new Promise((resolve, reject) =>  {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`completed with ${transactionReceipt.confirmations}`);
            resolve();
        })
    } )
    
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      
       const provider = new ethers.providers.Web3Provider(window.ethereum) 
        const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
    } else {
      connectButton.innerHTML = "Please install MetaMask"
    }
  }