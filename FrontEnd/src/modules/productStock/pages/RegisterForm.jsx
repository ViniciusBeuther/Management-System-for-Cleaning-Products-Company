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
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantityInStock, setQuantityInStock] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("O nome do produto é obrigatório.")
      .min(5, "O nome do produto deve ter pelo menos 5 caracteres"),
    description: Yup.string(),
    quantityInStock: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .required("A quantidade em estoque é obrigatória.")
      .min(0, "A quantidade não pode ser negativa.")
      .integer("A quantidade deve ser um número inteiro"),
    unitPrice: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : value))
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
    setQuantityInStock("");
    setUnitPrice("");
  };

  const onSubmit = (data) => {
    console.log("Dados validados:", data);
    resetStates();
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
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-0">{errors.name.message}</p>
          )}

          <Label htmlFor="productForm_description">Descrição</Label>
          <Input
            type="text"
            id="productForm_description_input"
            placeholder="Descrição do Produto"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-0">
              {errors.description.message}
            </p>
          )}

          <Label htmlFor="productForm_quantityInStock">
            Quantidade em estoque
          </Label>
          <Input
            type="number"
            id="productForm_quantityInStock_input"
            placeholder="Quantidade em estoque"
            {...register("quantityInStock", { valueAsNumber: true })}
          />
          {errors.quantityInStock && (
            <p className="text-red-500 text-sm mt-0">
              {errors.quantityInStock.message}
            </p>
          )}

          <Label htmlFor="productForm_unitPrice">Preço Unitário (R$)</Label>
          <Input
            type="number"
            id="productForm_unitPrice_input"
            placeholder="Preço Unitário"
            {...register("unitPrice", { valueAsNumber: true })}
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
          >
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
};

export default RegisterForm;
