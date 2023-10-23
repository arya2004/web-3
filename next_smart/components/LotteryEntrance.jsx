//add func to enter lottery

import { useWeb3Contract } from "react-moralis"
import {abi, contractAddress} from "../Constants"
import { useMoralis } from "react-moralis"


export default function LotteryEntrance(){
    const {chainID} = useMoralis()
    // const {runContractFunction: enterRaffle} = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: contractAddress, //specify netword id
    //     functionName: "observe",
    //     params: {},
    //     msgValue:

    // })

    return(
        <div>LE</div>
    )
}