import React,{useState} from "react";
import './VerificationRequest.css'
function VerificationRequest({estado, estadoTk,estadoN,estadoS, login}) {
    const [render,setRender]=useState(false)
    const [getR,setGetR]=useState("");
    const URL = "https://checkout-test.placetopay.com"
    
   let bodyget={
    "auth": {
        "login": `${login}`,
        "tranKey": `${estadoTk}`,
        "nonce": `${estadoN}`,
        "seed": `${estadoS}`
      },
   }
    
    const getRequestInformation = async(e) => {
        /* e.preventDefault(); */
        try{
            let response =await fetch(`${URL}/api/session/${estado}`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyget),
    });
    const data = await response.json();
    console.log(data);
    return data;
    }catch (error) {
        console.error(error);
      }
    };
   
    const validation= async()=>{
        let getRI= await getRequestInformation();
        
        if (getRI){
            console.log("soy",getRI);
            setGetR(getRI);
            setRender(true);
        }else{
            console.log("no ha comprado productos");
        }
    }
   
   
  
    
    return ( 
    
    <>
    
        {estado ? <button className="validation btn btn-primary" onClick={validation} >verificar pago</button>:<></>}
         {getR 
           ?  getR.status.status=='PENDING'?
            <div> 
                <p>{getR.status.status}</p>
                <p>{getR.status.message}</p>
                <p>Por favor dale click a ir al pago</p>
            </div> : 
            <div> 
            <p>{getR.status.status}</p>
            <p>{getR.status.message}</p>
            <p>{getR.requestId}</p>
            <p>pago de cop: {getR.payment[0].amount.to.total}</p>
            <p>referencia de pago: {getR.payment[0].reference}</p>
        </div>
        : <></>
            }
    </> 
    
    
    );
}

export default VerificationRequest;