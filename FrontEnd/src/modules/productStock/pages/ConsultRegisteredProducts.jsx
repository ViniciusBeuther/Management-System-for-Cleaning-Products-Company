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
import useRegEx from "@/hooks/useRegex";
import {
  API_REGISTERED_PRODUCT_GET_ROUTE,
  API_URL,
} from "@/utils/api/apiVariables";
import { ArrowLeft, ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ConsultRegisteredProducts = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalIsOpened, setModalIsOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const itemsPerPage = 8;
  const hookData = useGetFetch(API_URL + API_REGISTERED_PRODUCT_GET_ROUTE);
  const [errors, setErrors] = useState({
    product_name: false,
    product_price: false,
    product_description: false
  });
  const [errorMessages, setErrorMessages] = useState({
    product_name: '',
    product_price: '',
    product_description: '' 
  });

  // set the page to 1 when search bar is changed
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // loading data from DB
  if (!hookData) {
    return <p>Carregando...</p>;
  }

  // Call the validation and if it values are valid
  const updateRecord = ( updatedProductObj ) => {
    const areValidInputs = validateUpdatedInputs(updatedProductObj);
    
  };

  // Function used to validate updated input values before pass it thru the API 
  const validateUpdatedInputs = (updatedProductObj) => {
    const { product_name, product_description, product_price } = updatedProductObj;
    const regexPatternAmount = /^R\$ +([0-9]+\.[0-9]+$)/;
    const regexPatternProductName = /^[A-Za-z]+.*/;
    const regexPatternDescription = /(^[A-Za-z].*)|^$/;
  
    let isValid = true;
    const newErrors = {};
    const newMessages = {};
  
    if (!useRegEx({ content: product_name, regexPattern: regexPatternProductName })) {
      newErrors.product_name = true;
      newMessages.product_name = 'Nome deve começar com letra';
      isValid = false;
    } else {
      newErrors.product_name = false;
      newMessages.product_name = '';
    }
  
    if (!useRegEx({ content: product_price, regexPattern: regexPatternAmount })) {
      newErrors.product_price = true;
      newMessages.product_price = 'Formato de preço inválido (ex: R$ 10.99)';
      isValid = false;
    } else {
      newErrors.product_price = false;
      newMessages.product_price = '';
    }
  
    if (!useRegEx({ content: product_description, regexPattern: regexPatternDescription }) && product_description != null) {
      newErrors.product_description = true;
      newMessages.product_description = 'Descrição deve começar com letra';
      isValid = false;
    } else {
      newErrors.product_description = false;
      newMessages.product_description = '';
    }
  
    setErrors(newErrors);
    setErrorMessages(newMessages);
    // console.log(newErrors);
    return isValid;
  };

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
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setModalIsOpened(true);
  };

  // Close dialog modal
  const handleCloseModal = () => {
    setModalIsOpened(false);
    setSelectedProduct(null);
    setIsEditing(false);
    setErrorMessages({});
    setErrors({});
  };

  return (
    <section className="bg-gray-50 h-full">
      <HeaderComponent />
      <article className="p-5">
        <section className="flex justify-between mb-5 gap-5">
          <Link to="/home">
            <Button className="bg-primaryBtn hover:bg-primaryBtnHover text-black">
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
                <TableHead className="w-[10%] text-black font-bold">
                  ID do produto
                </TableHead>
                <TableHead className="w-[30%] text-black font-bold">
                  Produto
                </TableHead>
                <TableHead className="w-[12%] text-center text-black font-bold">
                  Preço de venda
                </TableHead>
                <TableHead className="w-[30%] text-center text-black font-bold">
                  Descrição (opcional)
                </TableHead>
                <TableHead className="w-[18%] text-center text-black font-bold">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((product) => (
                <TableRow
                  className="text-black"
                  key={product.product_id}
                >
                  <TableCell>{product.product_id}</TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell className="text-center">
                    {product.product_price}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.product_description}
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-center gap-2">
                    <Button 
                      size={'sm'}
                      className="text-white"
                      onClick={() => handleEditClick(product)}
                    >
                      <Pencil className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button 
                      size={'sm'}
                      className="bg-red-400 hover:bg-red-500 text-black"
                    >
                      <Trash className="w-4 h-4" />
                      Remover
                    </Button>
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
              className="bg-primaryBtn hover:bg-primaryBtnHover text-black"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </Button>
            <span className="font-bold">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-primaryBtn hover:bg-primaryBtnHover text-black"
            >
              Próximo <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Updates modal */}
        {modalIsOpened ? (
          <Dialog open={modalIsOpened} onOpenChange={(open) => !open && handleCloseModal()} size={"lg"}>
            <DialogContent aria-describedby={undefined}>
              <DialogHeader>
                <DialogTitle>Editar Informações do Produto</DialogTitle>
              </DialogHeader>
              {selectedProduct && (
                <section>
<article className="flex items-center gap-3 mb-2">
  <p className="w-[50%] whitespace-nowrap"><strong className="font-bold">Nome do produto:</strong></p>
  <div className="w-full">
    <Input
      type="text"
      value={selectedProduct.product_name}
      onChange={(ev) => setSelectedProduct(prev => ({ ...prev, product_name: ev.target.value }))}
      disabled={!isEditing}
      className={errors.product_name ? 'border-red-500' : ''}
    />
    {errors.product_name && (
      <p className="text-red-500 text-sm mt-1">{errorMessages.product_name}</p>
    )}
  </div>
</article>

<article className="flex items-center gap-3">
  <p className="w-[50%] whitespace-nowrap"><strong className="font-bold">Preço de venda (un):</strong></p>
  <div className="w-full">
    <Input
      type="text"
      value={selectedProduct.product_price}
      onChange={(ev) => setSelectedProduct(prev => ({ ...prev, product_price: ev.target.value }))}
      disabled={!isEditing}
      className={errors.product_price ? 'border-red-500' : ''}
    />
    {errors.product_price && (
      <p className="text-red-500 text-sm mt-1">{errorMessages.product_price}</p>
    )}
  </div>
</article>

<article className="flex items-center mt-2">
  <p className="w-[30%] whitespace-nowrap"><strong className="font-bold">Descrição:</strong></p>
  <div className="w-full">
    <Input
      type="text"
      value={selectedProduct.product_description != null ? selectedProduct.product_description : ""}
      onChange={(ev) => setSelectedProduct(prev => ({ ...prev, product_description: ev.target.value }))}
      disabled={!isEditing}
      className={errors.product_description ? 'border-red-500' : ''}
    />
    {errors.product_description && (
      <p className="text-red-500 text-sm mt-1">{errorMessages.product_description}</p>
    )}
  </div>
</article>

                  <article className="mt-5 flex gap-3 justify-end items-center">
                    <Button
                      className="bg-white hover:bg-primaryBtn border-primaryBtn border-[2px] text-sm text-black duration-500 py-1 px-2 rounded-lg hover:cursor-pointer"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      className="bg-successBtn hover:bg-successBtnHover hover:cursor-pointer text-black"
                      onClick={() => updateRecord(selectedProduct)}
                    >Salvar</Button>
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