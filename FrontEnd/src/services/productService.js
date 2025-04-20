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

export const deleteRegisteredProduct = async ( product_id, token, handleCloseModal ) => {
  try{
    const response = await fetch(API_URL + API_DELETE_REGISTERED_PRODUCT_ROUTE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product_id)
    });

    response.ok ? (handleCloseModal()) : (null);

    return true;
    
  } catch(error){
    console.log(`Something went wrong, error deleting record: ${error}`);
    
    return false;
  }
}