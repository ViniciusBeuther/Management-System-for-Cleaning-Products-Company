import { API_UPDATE_REGISTERED_PRODUCT_ROUTE, API_URL } from "@/utils/api/apiVariables";

export const updateRegisteredProduct = async (updatedProductObj, token) => {
    try {
        const response = await fetch(API_URL + API_UPDATE_REGISTERED_PRODUCT_ROUTE, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedProductObj)
        });
        setTimeout(() => handleCloseModal(), 1000 * 1.5);
  
        response.ok ? (
          Toast({
            title: "Sucesso",
            description: "Produto atualizado com sucesso.",
            variant: "default"
          }
          )
        ) : (
          Toast({
            title: "Erro",
            description: "Algo deu errado, tente novamente.",
            variant: "destructive"
          })
        );
  
        return response;
      } catch (error) {
        console.error('Update failed:', error);
      }
};