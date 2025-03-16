import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import HeaderComponent from "@/components/global/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { API_PRODUCT_REGISTER_ROUTE, API_URL } from "@/utils/api/apiVariables";

const RegisterForm = () => {
  const API_register_endpoint = API_URL + API_PRODUCT_REGISTER_ROUTE;

  const [product_name, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [product_price, setProductPrice] = useState("");
  const [cancelDialogIsOpen, setCancelDialogIsOpen] = useState(false);

  // validation for form
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("O nome do produto é obrigatório.")
      .min(5, "O nome do produto deve ter pelo menos 5 caracteres"),
    description: Yup.string(),
    unitPrice: Yup.number()
      .transform((value, originalValue) =>
        parseFloat(originalValue.replace(",", "."))
      )
      .required("O preço unitário é obrigatório.")
      .min(0, "O preço não pode ser negativo.")
      .positive("O preço deve ser maior que zero"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const resetStates = () => {
    setName("");
    setDescription("");
    setUnitPrice("");
  };

  const onSubmit = async (data) => {
    
    // console.log("Dados validados:", data);

    const productData = {
      product_name: data.name,
      product_price: data.unitPrice
    };

    try{
      const JWTToken = localStorage.getItem('token');

      const response = await fetch(API_register_endpoint, {
        method: 'POST',
        headers:  {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JWTToken}`,
        },
        body: JSON.stringify(productData),
      })

      if( !response.ok ){
          const errorMessage = await response.text();
          alert('Erro ao cadastrar produto.');
          
          return;
      }

      const responseData = await response.json();
      resetStates();
      alert('Produto inserido com sucesso!');
      
      return responseData;

    } catch( error ){
      console.log('Error: Cannot finished the http request: ' + error)
      alert('Erro ao inserir produto');
    }
    
  };

  return (
    <section className="bg-gray-50 h-full">
      <HeaderComponent />
      <h2 className="text-center">Cadastrar novo produto</h2>
      <form
        className="flex items-center justify-center flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p>
          Preencha os dados abaixo para cadastrar um novo produto no estoque:
        </p>
        <div className="grid w-full max-w-lg items-center gap-1.5">
          <Label htmlFor="productForm_name">Nome</Label>
          <Input
            type="text"
            id="productForm_name_input"
            placeholder="Nome do Produto"
            {...register("name")}
            value={product_name}
            onChange={(ev) => setProductName(ev.target.value)}
          />

          {errors.name && (
            <p className="text-red-500 text-sm mt-0">{errors.name.message}</p>
          )}

          <Label htmlFor="productForm_description">Descrição (Opcional)</Label>
          <Input
            type="text"
            id="productForm_description_input"
            placeholder="Descrição do Produto"
            {...register("description")}
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-0">
              {errors.description.message}
            </p>
          )}

          <Label htmlFor="productForm_unitPrice">Preço de venda da unidade (R$)</Label>
          <Input
            type="text"
            id="productForm_unitPrice_input"
            placeholder="Preço Unitário"
            {...register("unitPrice")}
            value={product_price}
            onChange={(ev) => setProductPrice(ev.target.value)}
          />
          {errors.unitPrice && (
            <p className="text-red-500 text-sm mt-0">
              {errors.unitPrice.message}
            </p>
          )}
        </div>

        {/* Buttons handling */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <Button className="bg-blue-400 hover:bg-blue-500 text-black">
            <Link to={"/home"}>Voltar</Link>
          </Button>

          <Button
            type="submit"
            className="bg-green-400 hover:bg-green-500 text-black"
          >
            Salvar
          </Button>
          <Button
            className="bg-red-400 hover:bg-red-500 text-black"
            onClick={() => setCancelDialogIsOpen(true)}
            type="button"
          >
            Cancelar
          </Button>
        </div>
        {/* Dialog to cancel the form */}
        <Dialog open={cancelDialogIsOpen} onOpenChange={setCancelDialogIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancelar cadastro</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Tem certeza que deseja cancelar o cadastro?
            </DialogDescription>
            <DialogFooter>
              <Button onClick={() => setCancelDialogIsOpen(false)}
                className="bg-red-400 hover:bg-red-500 text-black"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  resetStates();
                  setCancelDialogIsOpen(false);
                }}
                className="bg-green-400 hover:bg-green-500 text-black"
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </section>
  );
};

export default RegisterForm;
