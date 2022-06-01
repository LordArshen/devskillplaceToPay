const URL = "https://checkout-test.placetopay.com"

export async function createRequest(){
    try{
        let response =await fetch(`${URL}api/session`,{
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: "",
});
const data = await response.json();
console.log(data);
return data;
}catch (error) {
    console.error(error);
  }
}
 

