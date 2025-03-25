import { API_URL, API_REGISTERED_PRODUCT_GET_ROUTE } from "../api/apiVariables.js";

class productStockUtils{
  #registeredProducts;
  
  constructor(){
    this.#registeredProducts;
  }

  async fetchRegisteredProducts(){
    const JWTToken = localStorage.getItem('token');
    const API_EndPoint = API_URL + API_REGISTERED_PRODUCT_GET_ROUTE;

    const response = await fetch(API_EndPoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JWTToken}`,
      }
    });
    const dataJson = await response.json();

    this.setRegisteredProducts(dataJson);
    return dataJson;
  }

  getRegisteredProducts(){
    return this.#registeredProducts;
  }

  setRegisteredProducts(data){
    this.#registeredProducts = data;
  }

}
const productStockUtil = new productStockUtils();
const returned = await productStockUtil.fetchRegisteredProducts();
console.log(returned);