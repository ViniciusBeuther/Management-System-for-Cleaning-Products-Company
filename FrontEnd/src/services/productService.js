import { Toast } from "@/components/ui/toast";
import { API_DELETE_REGISTERED_PRODUCT_ROUTE, API_UPDATE_REGISTERED_PRODUCT_ROUTE, API_URL } from "@/utils/api/apiVariables";

export const updateRegisteredProduct = async (updatedProductObj, token, handleCloseModal) => {
    try {
        const response = await fetch(API_URL + API_UPDATE_REGISTERED_PRODUCT_ROUTE, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedProductObj)
        });
        
        response.ok != null || response.ok != undefined ? (setTimeout(() => handleCloseModal(), 1000 * 1)) : (null);

        return true;

      } catch (error) {
        console.error('Update failed:', error);
        
        return false;
      }
};

/**
 * 
 * @param { product_id } productObject : product to be deleted
 * @param { JWT } token  : JWT token for authentication
 * @param { function } handleCloseModal : function to close modal
 * @returns { boolean } : true in success cases other than that returns false
 */

export const deleteRegisteredProduct = async ( productObject, token, handleCloseModal ) => {
  try{
    const response = await fetch(API_URL + API_DELETE_REGISTERED_PRODUCT_ROUTE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productObject)
    });


    response.ok ? (handleCloseModal()) : (null);

    return true;
    
  } catch(error){
    console.log(`Something went wrong, error deleting record: ${error}`);
    
    return false;
  }
}