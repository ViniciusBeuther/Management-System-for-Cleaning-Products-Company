import LoginClass from "@/utils/login/util";
import React, { useState } from "react";

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleClick =  () => {
    const loginClass = new LoginClass();
    if( loginClass.logIn(user, password) ){
      setHasError(true);
    } 
  }

  return (
    <div className="relative flex min-h-screen text-gray-800 antialiased flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
      <div className="relative py-3 sm:w-96 mx-auto text-center">
        <span className="text-2xl font-light ">Entrar na sua conta</span>
        <div className="mt-4 bg-white shadow-md rounded-lg text-left">
          <div className="h-2 bg-blue-400 rounded-t-md"></div>
          <div className="px-8 py-6 ">
            <label className="block font-semibold"> Usuário </label>
            <input
              type="text"
              value={user}
              placeholder="Usuário"
              onChange={(ev) => setUser(ev.target.value)}
              className={`border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md
              ${hasError ? 'border-red-400' : ''}
              `}
            />
            <label className="block mt-3 font-semibold"> Senha </label>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className={`border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md
                ${hasError ? 'border-red-400' : ''}
                `}

            />
            <label hidden={!hasError} htmlFor="incorrect_login" className="text-red-400">Usuário ou senha incorretos.</label>
            <div className="flex justify-between items-baseline">
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
                onClick={() => handleClick()}
              >
                Entrar
              </button>
              <a href="#" className="text-sm hover:underline">
                Esqueceu sua senha?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
