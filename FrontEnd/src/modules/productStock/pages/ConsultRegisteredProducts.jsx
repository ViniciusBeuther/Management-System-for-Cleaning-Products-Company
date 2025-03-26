import HeaderComponent from "@/components/global/Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetFetch from "@/hooks/useGetFetch";
import {
  API_REGISTERED_PRODUCT_GET_ROUTE,
  API_URL,
} from "@/utils/api/apiVariables";
import { ArrowLeft, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ConsultRegisteredProducts = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalIsOpened, setModalIsOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 10;
  const hookData = useGetFetch(API_URL + API_REGISTERED_PRODUCT_GET_ROUTE);

  // set the page to 1 when search bar is changed
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // loading data from DB
  if (!hookData) {
    return <p>Carregando...</p>;
  }

  // Filter by name/description
  const filteredData = hookData.filter(
    (product) =>
      product.product_name.toLowerCase().includes(search.toLowerCase()) ||
      (product.product_description &&
        product.product_description
          .toLowerCase()
          .includes(search.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle line click, pass the product to modal and open it
  const handleLineClick = (product) => {
    setSelectedProduct(product);
    setModalIsOpened(true);
  };

  // Close dialog modal
  const handleCloseModal = () => {
    setModalIsOpened(false);
    setSelectedProduct(null);
  };

  return (
    <section className="bg-gray-50 h-full">
      <HeaderComponent />
      <article className="p-5">
        <section className="flex justify-between mb-5 gap-5">
          <Link to="/home">
            <Button className="bg-blue-400 hover:bg-blue-500 text-black">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
          <Input
            className="border border-gray-300 p-2 rounded-md"
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>
        <section>
          <h2>Consulta de Produtos</h2>
          <p>
            Faça consultas, alterações e remoção nos produtos cadastrados no seu
            inventário.
          </p>
        </section>
        <section>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%] text-black font-bold">
                  ID do produto
                </TableHead>
                <TableHead className="w-[30%] text-black font-bold">
                  Produto
                </TableHead>
                <TableHead className="w-[15%] text-center text-black font-bold">
                  Preço de venda
                </TableHead>
                <TableHead className="w-[40%] text-center text-black font-bold">
                  Descrição (opcional)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((product) => (
                <TableRow
                  className="text-black hover:cursor-pointer"
                  key={product.product_id}
                  onClick={() => handleLineClick(product)}
                >
                  <TableCell>{product.product_id}</TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell className="text-center">
                    {product.product_price}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.product_description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
        {/* Control pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="bg-blue-400 hover:bg-blue-500 text-black"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </Button>
            <span className="font-bold">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-blue-400 hover:bg-blue-500 text-black"
            >
              Próximo <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Updates modal */}
        {modalIsOpened ? (
          <Dialog open={modalIsOpened} onOpenChange={setModalIsOpened} >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Informações do Produto</DialogTitle>
                <DialogDescription className="text-md whitespace-nowrap">
                  Veja as informações abaixo referente ao produto selecionado:
                </DialogDescription>
              </DialogHeader>
              {selectedProduct && (
                <section>
                  <article>
                    <p className="text-md mt-0"><strong className="font-bold">ID Produto:</strong> { selectedProduct.product_id }</p>
                  </article>

                  <article className="flex items-center gap-3">
                  <p><strong className="font-bold">Nome do produto:</strong> {selectedProduct.product_name}</p>
                    <section className="bg-blue-400 hover:bg-blue-500 p-1 rounded-lg mt-2 hover:cursor-pointer">
                      <Pencil className="w-4 h-4" />
                    </section>
                  </article>

                  <article className="flex items-center gap-3">
                    <p><strong className="font-bold">Preço de venda (un):</strong> {selectedProduct.product_price}</p>
                    <section className="bg-blue-400 hover:bg-blue-500 p-1 rounded-lg mt-2 hover:cursor-pointer">
                      <Pencil className="w-4 h-4" />
                    </section>
                  </article>

                  <article className="flex items-center gap-3">
                    { selectedProduct.product_description != null ? (
                      <article className="flex items-center gap-3">
                        <p><strong className="font-bold">Descrição do produto:</strong> {selectedProduct.product_description}</p>
                        <section className="bg-blue-400 hover:bg-blue-500 p-1 rounded-lg mt-2 hover:cursor-pointer">
                      <Pencil className="w-4 h-4" />
                    </section>
                      </article>
                    ) : (
                      <article>
                        <Button
                          className="bg-blue-400 hover:bg-blue-500 mt-2 max-w-sm text-sm text-black"
                        >+ Descrição</Button>
                      </article>
                    ) }
                  </article>

                  <article className="mt-5 flex gap-3 justify-end items-center">
                    <Button
                      className="bg-red-400 hover:bg-red-500 hover:cursor-pointer text-black"
                    >Excluir Item</Button>
                    <Button 
                      className="bg-blue-400 hover:bg-blue-500 hover:cursor-pointer text-black"
                    >Sair</Button>
                  </article>
                </section>
              )}
            </DialogContent>
          </Dialog>
        ) : null}
      </article>
    </section>
  );
};

export default ConsultRegisteredProducts;