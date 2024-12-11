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

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantityInStock, setQuantityInStock] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  // States to control the dialog (modal)
  const [saveIsOpened, setSaveIsOpened] = useState(true);
  const [cancelIsOpened, setCancelIsOpened] = useState(false);

  const resetStates = () => {
    setName("");
    setDescription("");
    setQuantityInStock("");
    setUnitPrice("");
  };

  const submitRequest = (ev) => {
    ev.preventDefault();
    console.log("Inserindo: " + name);
    console.log("Inserindo: " + description);
    console.log("Inserindo: " + quantityInStock);
    console.log("Inserindo: " + unitPrice);

    resetStates();
  };

  return (
    <section className="bg-gray-50 h-full">
      <HeaderComponent />
      <h2 className="text-center">Cadastrar novo produto</h2>
      <form
        className="flex items-center justify-center flex-col gap-2"
        onSubmit={submitRequest}
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
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />

          <Label htmlFor="productForm_description">Descrição</Label>
          <Input
            type="text"
            id="productForm_description_input"
            placeholder="Descrição do Produto"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />

          <Label htmlFor="productForm_description">Quantidade em estoque</Label>
          <Input
            type="number"
            id="productForm_description_input"
            placeholder="Quantidade em estoque"
            value={quantityInStock}
            onChange={(ev) => setQuantityInStock(ev.target.value)}
          />

          <Label htmlFor="productForm_unitPrice">Preço Unitário (R$)</Label>
          <Input
            type="number"
            id="productForm_unitPrice_input"
            placeholder="Preço Unitário"
            value={unitPrice}
            onChange={(ev) => setUnitPrice(ev.target.value)}
          />
        </div>

        <div className="flex items-center justify-center gap-2 mt-5">
          <Button className="bg-blue-400 hover:bg-blue-500 text-black">
            <Link to={"/home"}>Voltar</Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-400 hover:bg-green-500 text-black">
                Salvar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  Tem certeza que deseja cadastrar esse produto?
                </DialogTitle>
                <DialogDescription>
                  Revise as informações antes de finalizar:
                </DialogDescription>
                <DialogDescription>Nome do produto: {name}</DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                    id="link"
                    defaultValue="https://ui.shadcn.com/docs/installation"
                    readOnly
                  />
                </div>
                <Button type="submit" size="sm" className="px-3">
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button className="bg-red-400 hover:bg-red-500 text-black">
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
};

export default RegisterForm;
