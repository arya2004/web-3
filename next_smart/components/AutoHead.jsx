import { ConnectButton } from "web3uikit";

export default function AutoHead(){
    return (
        <div>
            Decentralized Lottery
            <ConnectButton moralisAuth={false}></ConnectButton>
        </div>
    )
}