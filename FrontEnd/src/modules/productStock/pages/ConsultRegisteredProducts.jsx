import HeaderComponent from "@/components/global/Header";
import ErrorToast from "@/components/Toast/ErrorToast";
import SuccessToast from "@/components/Toast/SuccessToast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { deleteRegisteredProduct, updateRegisteredProduct } from "@/services/productService";
import {
  API_REGISTERED_PRODUCT_GET_ROUTE,
  API_URL,
} from "@/utils/api/apiVariables";
import { ArrowLeft, ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ConsultRegisteredProducts = () => {
  /* Variables Initialization */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalIsOpened, setModalIsOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const itemsPerPage = 8;
  const [refreshPage, setRefreshPage] = useState(0);
  const [wasUpdated, setWasUpdated] = useState(false);
  const [wasRemoved, setWasRemoved] = useState(false);
  const [wasNotRemoved, setWasNotRemoved] = useState(false);
  const [wasNotUpdated, setWasNotUpdated] = useState(false);
  const [idToDelete, setIdToDelete] = useState();
  const hookData = useGetFetch(API_URL + API_REGISTERED_PRODUCT_GET_ROUTE, refreshPage);
  const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false);
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
  const hasToken = localStorage.getItem('token') !== null;
  // If there is no token, redirect to login page
  if (!hasToken) {
    window.location.href = '/';
    return null;
  }

  // set the page to 1 when search bar is changed
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // loading data from DB
  if (!hookData) {
    return <p>Carregando...</p>;
  }

  // Call the validation and if it values are valid
  const updateRecord = async (updatedProductObj) => {
    const areValidInputs = validateUpdatedInputs(updatedProductObj);
    if (!areValidInputs) return;

    const JWT_TOKEN = localStorage.getItem('token');
    let temp = await updateRegisteredProduct(updatedProductObj, JWT_TOKEN, handleCloseModal);
    setTimeout(() => setWasUpdated(true), 1000 * 2);
    
    // If was updated successfully, shows the toast
    if( temp ){
      setTimeout(() => setWasUpdated(false), 1000 * 8);
    } else {
      setWasNotUpdated(true);
      setTimeout(() => setWasNotUpdated(false), 1000 * 8);
    }
    setRefreshPage(prev => prev + 1);
    // setWasUpdated(temp);
  };

  // Function used to validate updated input values before pass it thru the API 
  const validateUpdatedInputs = (updatedProductObj) => {
    const { product_name, product_description, product_price } = updatedProductObj;
    const regexPatternAmount = /^R?\$?\s*\d+(,\d{2}|\.\d{2})?$/;
    const regexPatternProductName = /^[A-Za-z]+.*/;
    const regexPatternDescription = /(^[A-Za-z].*)|^$/;
    console.log(`object being passed to http: ${updatedProductObj}`);
    
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

  const handleDeleteClick = (product_id) => {
    setIsShowingDeleteModal(true);
    setIdToDelete(product_id);
  }

  const handleCloseDeleteModal = () => {
    setIsShowingDeleteModal(false);
  }

  const onDeleteConfirm = async () => {
    const JWT_Token = localStorage.getItem('token');
    try{
      //console.log(`JSON: ${JSON.stringify(requestObject)}`)
      let temp = await deleteRegisteredProduct({ product_id: idToDelete }, JWT_Token, handleCloseDeleteModal);

      if(temp){
        // alert("Produto removido com sucesso.")
        setRefreshPage(prev => prev + 1);
        setWasRemoved(true);
        setTimeout(() => setWasRemoved(false), 1000 * 5);
      } else {
        alert("houve um erro, tente novamente")
        setWasNotRemoved(true);
        setTimeout(() => setWasNotRemoved(false), 1000 * 5);
      }

    } catch( error ){
      console.log("Error on delete: message of error: ", error);
    }

  }

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
                      onClick={() => handleDeleteClick(product.product_id)}
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
        
        {isShowingDeleteModal ? (
          <Dialog open={isShowingDeleteModal} onOpenChange={(open) => !open && handleCloseDeleteModal()} size={"lg"}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tem certeza que deseja excluir este item?</DialogTitle>
              </DialogHeader>
              <p>Quer deletar esse item? <strong>Essa ação não pode ser desfeita.</strong></p>
              <section className="flex justify-end gap-3 mt-5">
                <Button>Cancelar</Button>
                <Button
                  onClick={() => onDeleteConfirm()}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >Apagar</Button>

              </section>
            </DialogContent>
          </Dialog>
        ) : null}

        {/* updated Toast */}
        { wasUpdated ? (
          <SuccessToast message={"Produto atualizado com sucesso"} onClose={null} />
        ) : (null) }

        {/* removed Toast */}
        { wasRemoved ? (
          <SuccessToast message={"Produto removido com sucesso"} onClose={null} />
        ) : (null) }

        {/* not removed Toast */}
        { wasNotRemoved ? (
          <ErrorToast message={"Houve um erro ao remover o produto"} onClose={null} />
        ) : (null) }

        {/* not updated Toast */}
        { wasNotUpdated ? (
          <ErrorToast message={"Houve um erro ao atualizar o produto"} onClose={null} />
        ) : (null) }
      </article>
    </section>

  );
};

export default ConsultRegisteredProducts;