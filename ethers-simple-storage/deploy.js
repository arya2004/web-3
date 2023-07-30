

const { log } = require("console");
const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config()

async function main()
{
   //http://127.0.0.1:7545
   const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
   const abi = fs.readFileSync("./simpleStorage_sol_SimpleStorage.abi", "utf-8");
   const binary = fs.readFileSync("./simpleStorage_sol_SimpleStorage.bin", "utf-8");


   const contraceFactory = new ethers.ContractFactory(abi, binary, wallet);
   console.log("deploying");
   const contract = await contraceFactory.deploy({gasPrice: 10000000000})
   const transactionReceipt = await contract.deploymentTransaction().wait(1);

   console.log("deploy with transaction data");


const currentFav = await contract.retrieve()
console.log(currentFav.toString());

const transRes = await contract.store("7");
const transrecpt = await transRes.wait(1);
const currentFavUPDATED = await contract.retrieve()
console.log(currentFavUPDATED.toString());


}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1); 
    })

    // yarn solcjs --bin --abi --include-path node_modules/     
   // yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . simpleStorage.sol