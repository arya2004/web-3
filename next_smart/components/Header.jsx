import { useMoralis } from "react-moralis"
import { useEffect } from "react";

export default function Home(){

    const {enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis();
    //if anything in arrya changes, rerendered
    useEffect(() => {
        if(isWeb3Enabled) return
        if(typeof window !== "undefined"){ 
            if(window.localStorage.getItem("connected")){

                enableWeb3()
            }
        }
        

    }, [isWeb3Enabled])
    //no aray => rerenderes when something changes
    //blank array => once

    useEffect(() => {
        Moralis.onAccountChanged((account) =>{
            console.log(account);
            if(account == null){
                window.localStorage.removeItem("connected");
                deactivateWeb3();
                console.log("noe acc");
            }
        } )
    },[])



    return (<div>
        {account ? (<div>Cnnecterd to {account} </div>) : (
            <button onClick={async () => {
                await enableWeb3()
                if(typeof window !== "undefined")
                { 
                    window.localStorage.setItem("connected", "inject")
                }
               
            }}
            disabled={isWeb3EnableLoading}

            >  Connect</button>

        ) }
        
    </div>)
}