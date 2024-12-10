// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = "http://localhost:3000/";

export default class LoginClass{
  // Method to access the API and get the token to be able to access internal/confidential pages
  async logIn(username, password){
    try{
      if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables");
    }
    
    // Request to the API to authenticate and get the JWT 
    const response = await fetch(API_URL + 'auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Erro na autenticação');
    }
    const token = data.token;

    // Save the token into the local machine
    localStorage.setItem('token', token);

    // Redirect to dashboard page
    window.location.href = '/home';
    // console.log(`Token received: ${data.token}`);

    return token;
    
    } catch(error) {
      alert(`Usuário ou senha incorretos`);
      return false;
    };
  }
};
