import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
const axios = require('axios')
const FormData = require('form-data')

const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiMzE4M2Q0NC1jNjkxLTQzNDItYWQ0NC0xNGNkMmE0ZmViN2YiLCJlbWFpbCI6ImFyeWEyMGo0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4NWQ4YzhjOGFmMWIyZTcyYTdiZCIsInNjb3BlZEtleVNlY3JldCI6IjIwZmY5YTI1NzdkZTc3MGE1MTYzYmM4YzI3ZjgxMTIzMzU1Mjc3OTg4Y2NhYjc3NWVmNTUyNjQ3ZDhmNWM4NDkiLCJpYXQiOjE3MDE3MTY4MjZ9.znufFjwsvDVYAKTtJc2jJFTMVsV7PF7jBDzLNLiGcX8'

const pinataApiKey="85d8c8c8af1b2e72a7bd"
const pinataSecretApiKey="20ff9a2577de770a5163bc8c27f81123355277988ccab775ef552647d8f5c849"


const client = ipfsHttpClient('https://infura-ipfs.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function CreateItem() {

    //ipfs file to upload
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const router = useRouter()

    async function onChange(e) {
        const file = e.target.files[0]
   
    
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

        //we gather a local file for this example, but any valid readStream source will work here.
        let data = new FormData();
        data.append('file', file);
    
        return axios.post(url,
            data,
            {
                maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    'pinata_api_key': pinataApiKey,
                    'pinata_secret_api_key': pinataSecretApiKey
                }
            }
        ).then(function (response) {
            //handle response here
        }).catch(function (error) {
            //handle error here
        });
      }


    async function createMarket() {
        const { name, description, price } = formInput
        if (!name || !description || !price || !fileUrl) return
        /* first, upload to IPFS */
        const data = JSON.stringify({
          name, description, image: fileUrl
        })
        try {
          const added = await client.add(data)
          const url = `https://infura-ipfs.io/ipfs/${added.path}`
          /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
          createSale(url)
        } catch (error) {
          console.log('Error uploading file: ', error)
        }  
      }

    async function createSale(url) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)    
        const signer = provider.getSigner()
        
        /* next, create the item */
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        let transaction = await contract.createToken(url)
        let tx = await transaction.wait()

        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
    
        const price = ethers.utils.parseUnits(formInput.price, 'ether')
      
        /* then list the item for sale on the marketplace */
        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString() 
    
        transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
        await transaction.wait()
        router.push('/')
      }

    //    const pinFileToIPFS = async () => {
    //     const formData = new FormData();
    //     const src = "path/to/file.png";
        
    //     const file = fs.createReadStream(src)
    //     formData.append('file', file)
        
    //     const pinataMetadata = JSON.stringify({
    //       name: 'File name',
    //     });
    //     formData.append('pinataMetadata', pinataMetadata);
        
    //     const pinataOptions = JSON.stringify({
    //       cidVersion: 0,
    //     })
    //     formData.append('pinataOptions', pinataOptions);
    
    //     try{
    //       const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
    //         maxBodyLength: "Infinity",
    //         headers: {
    //           'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
    //           Authorization: JWT
    //         }
    //       });
    //       console.log(res.data);
    //     } catch (error) {
    //       console.log(error);
    //     }
    // }
    

      return (
        <div className="flex justify-center">
          <div className="w-1/2 flex flex-col pb-12">
            <input 
              placeholder="Asset Name"
              className="mt-8 border rounded p-4"
              onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
            />
            <textarea
              placeholder="Asset Description"
              className="mt-2 border rounded p-4"
              onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
            />
            <input
              placeholder="Asset Price in Eth"
              className="mt-2 border rounded p-4"
              onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
            />
            <input
              type="file"
              name="Asset"
              className="my-4"
              onChange={onChange}
            />
            {
              fileUrl && (
                <img className="rounded mt-4" width="350" src={fileUrl} />
              )
            }
            <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
              Create Digital Asset
            </button>
          </div>
        </div>
      )

}