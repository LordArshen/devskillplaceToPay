import React, { useState } from 'react';
import './Formulario.css'
import Base64 from 'crypto-js/enc-base64';
import sha1 from 'crypto-js/sha1';
import CryptoJS from 'crypto-js/'
import VerificationRequest from '../VerificationRequest/VerificationRequest';



export default function Formulario(){
    const [login, setLogin] = useState('');
    const [secretKey, setSecretkey] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [documentType,setDocumentType] = useState('');
    const [document, setDocument] = useState('');
    const [mobile, setMobile] = useState('');
    const[dataResponse,setDataResponse] =useState('');

    
    
    let nonce =  Math.random().toString(36).substring(7);
    let seed = (new Date()).toISOString();
    let trankey = Base64.stringify(sha1(nonce+seed+secretKey))
    let nonceParse=CryptoJS.enc.Utf8.parse(nonce);
    let nonceB64=Base64.stringify(nonceParse)
    /* console.log(trankey);
    console.log(nonceB64);
    console.log(seed); */
    let fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate()+1)
    let expirationSeed=fechaActual.toISOString()
      

    let bodyRequest ={
        "locale": "es_CO",
        "buyer": {
            "name": `${name}`,
            "surname": `${surname}`,
            "email": `${email}`,
            "documentType": `${documentType}`,
            "document": `${document}`,
            "mobile": `${mobile}`,
        },
        "auth": {
            "login": `${login}`,
            "tranKey": `${trankey}`,
            "nonce": `${nonceB64}`,
            "seed": `${seed}`
          },
          "payment": {
            "reference": "1122334455",
            "description": "Prueba",
            "amount": {
              "currency": "USD",
              "total": 100
            },
            "allowPartial": false
          },
          "expiration": `${expirationSeed}`,
          "returnUrl": "https://vermillion-gumdrop-e5cf44.netlify.app/",
          "ipAddress": "127.0.0.1",
          "userAgent": "PlacetoPay Sandbox"
    }

    const URL = "https://checkout-test.placetopay.com"

const createRequest = async(e) => {
    e.preventDefault();
    try{
        let response =await fetch(`${URL}/api/session`,{
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(bodyRequest),
});
const data = await response.json();
console.log(data);
return setDataResponse(data);
}catch (error) {
    console.error(error);
  }
}
    return (
        <div className='container'>
            <h2>Realizar un pago</h2>
            <form  className="payForm" onSubmit={createRequest}>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">
                    <h3>ingresa tu login placeTopay: </h3>
                </label>
                <input type="text" className="form-control"  required placeholder="ingresa tu nombre" onChange={
                    e=>setLogin(e.target.value)
                } />
                
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">
                    <h3>ingresa tu secretKey: </h3>
                </label>
                <input type="text" className="form-control"  required placeholder="ingresa tu nombre" onChange={
                    e=>setSecretkey(e.target.value)
                } />
                
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">
                    <h3>ingresa tu nombre: </h3>
                </label>
                <input type="text" className="form-control"  required placeholder="ingresa tu nombre" onChange={
                    e=>setName(e.target.value)
                } />
                
            </div>
            <div className="form-group">
            <label htmlFor="exampleInputEmail1">
                    <h3>ingresa tu apellido: </h3>
                </label>
                <input type="text" className="form-control"  placeholder=" ingresa tu apellido" required
                onChange={
                    e=>setSurname(e.target.value)
                }/>
            </div>
            <div className="form-group">
            <label htmlFor="exampleInputEmail1">
                    <h3>ingresa tu email: </h3>
                </label>
                <input type="email" className="form-control"  placeholder=" ingresa tu email" required onChange={
                    e=>setEmail(e.target.value)
                }
               />
            </div>

            <div className="form-group">
            <label htmlFor="exampleInputEmail1">
                    <h3>ingresa tu documento: </h3>
                </label>
                <select className="form-control"><option value="" selected="selected" onChange={
                    e=>setDocumentType(e.target.value)
                }>Selecciona una opción</option> <optgroup label="Colombia"><option value="CC">
                Cédula de ciudadanía
            </option><option value="CE">
                Cédula de extranjería
            </option><option value="NIT">
                NIT
            </option><option value="RUT">
                RUT
            </option><option value="TI">
                Tarjeta identidad
            </option></optgroup></select>
            </div>
            <div className="form-group">
            <label htmlFor="exampleInputEmail1">
                    <h3>ingresa tu documento: </h3>
                </label>
                <input type="number" className="form-control"  placeholder=" ingresa documento" required onChange={
                    e=>setDocument(e.target.value)
                }
               />
               
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">
                    <h3>ingresa tu mobile: </h3>
                </label>
                <input type="number" className="form-control"  required placeholder="ingresa tu nombre" onChange={
                    e=>setMobile(e.target.value)
                } />
                
            </div>
            
            
            <button type="submit" className="btn btn-primary">cargar pago</button>
            </form>
            {dataResponse ? <button className="request btn btn-primary"> <a href={dataResponse.processUrl} target="_blank">ir al pago</a></button>:<></>}

            { <VerificationRequest/>? <VerificationRequest estado={dataResponse.requestId} estadoTk={bodyRequest.auth.tranKey}
            estadoN={bodyRequest.auth.nonce} estadoS={bodyRequest.auth.seed} login={login}/> :<div>Esperando cargar pago</div> }
                
        </div>    
    )


}