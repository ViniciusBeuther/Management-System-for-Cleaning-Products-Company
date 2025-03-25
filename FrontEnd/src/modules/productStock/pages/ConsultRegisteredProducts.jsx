import HeaderComponent from '@/components/global/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useGetFetch from '@/hooks/useGetFetch';
import { API_REGISTERED_PRODUCT_GET_ROUTE, API_URL } from '@/utils/api/apiVariables';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ConsultRegisteredProducts = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const hookData = useGetFetch(API_URL + API_REGISTERED_PRODUCT_GET_ROUTE)
  hookData.forEach((item) => console.log(item))

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const API_EndPoint = API_URL + API_REGISTERED_PRODUCT_GET_ROUTE;
    const JWT_TOKEN = localStorage.getItem('token');
    
    try {
      const response = await fetch(API_EndPoint, {
        method: 'GET',
        headers: { Authorization: `Bearer ${JWT_TOKEN}` }
      });
      
      const jsonData = await response.json();
      setData(jsonData.data || []);
    } catch (error) {
      console.log('Error fetching registered products: ' + error);
    }
  }

  // Filtragem por nome e descrição
  const filteredData = data.filter(product =>
    product.product_name.toLowerCase().includes(search.toLowerCase()) ||
    (product.product_description && product.product_description.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section className="bg-gray-50 h-full">
      <HeaderComponent />
      <article className='p-5'>
        <section className='flex justify-between mb-5'>
          <Button className="bg-blue-400 hover:bg-blue-500 text-black">
            <ArrowLeft className='w-4 h-4' />
            <Link to="/home">Voltar</Link>
          </Button>
          <Input
            className='border border-gray-300 p-2 rounded-md'
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>
        <section>
          <h2>Consulta de Produtos</h2>
          <p>Faça consultas, alterações e remoção nos produtos cadastrados no seu inventário.</p>
        </section>
        <section>
          <Table>
            <TableHeader>
              <TableRow className='border-[1px] border-black'>
                <TableHead>ID do produto</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Preço de venda</TableHead>
                <TableHead>Descrição (opcional)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((product) => (
                <TableRow className='text-black' key={product.product_id}>
                  <TableCell>{product.product_id}</TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.product_price}</TableCell>
                  <TableCell>{product.product_description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
        {/* Controles de paginação */}
        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className='w-4 h-4' /> Anterior
          </Button>
          <span>Página {currentPage} de {totalPages}</span>
          <Button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Próximo <ChevronRight className='w-4 h-4' />
          </Button>
        </div>
      </article>
    </section>
  );
}

export default ConsultRegisteredProducts;
