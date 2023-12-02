//add func to enter lottery

import { useWeb3Contract } from "react-moralis"
import {abi, contractAddresses} from "../Constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"


export default function LotteryEntrance(){
    const {chainId: chainIdHex, isWeb3Enabled} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    // const {runContractFunction: enterRaffle} = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: raffleAddress, //specify netword id
    //     functionName: "enterRaffle",
    //     params: {},
    //     msgValue: "d"

    // })
    const {runContractFunction: getEntranceFee} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify netword id
        functionName: "getEntranceFee",
        params: {}

    })



    useEffect(() => {
        if(isWeb3Enabled){
            //try read entrance fee
            async function updateUI(){
                const entranceFeeFromCall = (await getEntranceFee()).toString()
                console.log(entranceFeeFromCall);
                setEntranceFee(entranceFeeFromCall)
            }
            updateUI();
        }
    },[isWeb3Enabled])

    return(
        <div>Hello from entrance
            <div>
               {entranceFee} 
            </div>
        </div>
    )
}