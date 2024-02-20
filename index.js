// import { resolve } from "styled-jsx/css"
import { abi, contractAddress } from "./constants.js"
import {ethers} from "./ethers-5.1.esm.min.js"


const connect_b = document.getElementById("connectButton")
connect_b.onclick = connect
const fund_b = document.getElementById("fundButton")
fund_b.onclick = fund
const balance_b = document.getElementById("balanceButton")
balance_b.onclick = getContractBalance
const withdraw_b = document.getElementById("withdrawButton")
withdraw_b.onclick = withdraw

function listenForEvents(txResponse, providEr){
    console.log("Listening for ", txResponse.hash, "events")
    return new Promise((resolve, reject)=>{
        try{
            providEr.once(txResponse, (txReceipt)=>{console.log("Confirmed ",txReceipt.confirmations)})
            resolve()
        }
        catch(e){
            reject(e)
        }
    })
    
}
async function connect(){
    if (typeof window.ethereum!==undefined){
        try{
            await ethereum.request({method:"eth_requestAccounts"})
            connect_b.innerHTML = "connected"
        }
        catch(e){
            console.log(e)
        }
        
    }
    else{
        connect_b.innerHTML = "Please install metamask"
    }
}
async function fund(){
    // function listenForEvents(txResponse, providEr){
    //     console.log("Listening for ", txResponse.hash, "events")
    //     return new Promise((resolve, reject)=>{
    //         providEr.once(txResponse, (txReceipt)=>{console.log("Confirmed ",txReceipt.confirmations)})
    //         resolve()
    //     })
        
    // }
    const eth_input = document.getElementById("ethAmount").value
    // abi, address
    //  signer
    // const ethAmount = ethers.utils.formatEther(eth_input)
    if (typeof window.ethereum!==undefined){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        console.log(provider)
        // console.log(contract.owner())
        try{
            const transactionResponse = await contract.fund({value:ethers.utils.parseEther(eth_input)})
            await listenForEvents(transactionResponse, provider)
            // console.log("Listening for ", transactionResponse.hash, "events")
            
            // await provider.once(transactionResponse, (txReceipt)=>{console.log("Confirmed ",txReceipt.confirmations)})
            // return new Promise((resolve, reject)=>{
            //     provider.once(transactionResponse, (txReceipt)=>{console.log("Confirmed ",txReceipt.confirmations)})
            //     resolve()
            // })
            console.log("Funded")
        }
        catch(e){
            console.log(e)
        }
        
    }
    else{
        connect_b.innerHTML = "Please install metamask"
    }
}



async function getContractBalance(){
    if (typeof window.ethereum!==undefined){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const signer = provider.getSigner()
        // const contract = new ethers.Contract(contractAddress, abi, signer)
        const contract_balance  = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(contract_balance))        
    }
}

async function withdraw(){
    if (typeof window.ethereum!==undefined){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        console.log("Withdrawing")  
        const Withdrawal_response = await contract.withdraw()  
        await listenForEvents(Withdrawal_response, provider)
        console.log("Withdrawn...")
        // await provider.once(Withdrawal_response, (withdraw_receipt)=>{
        //     console.log("Withdrawn ", withdraw_receipt.confirmations)
        // })    
    }
}