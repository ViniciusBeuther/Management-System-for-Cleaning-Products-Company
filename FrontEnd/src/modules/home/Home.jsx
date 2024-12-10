import {
  Accordion as BaseAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import HeaderComponent from "../../components/global/Header";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const linksForStorageModule = [
    ["Cadastro e remoção de produtos", "/products"],
    ["Verificar estoque", "/storage"],
    ["Recebimento de Produtos", "/productReceivingForm"],
  ];
  const linksForOrders = [
    "Emitir pedido",
    "Cadastrar novo pedido",
    "Histórico de pedidos",
    "Consultar pedidos em aberto",
    "Emitir pedido em PDF",
  ];
  const linksForCosts = [
    "Fluxo de caixa",
    "Precificação de produto",
    "Custos por produto",
  ];
  const linksForReports = [
    "Faturamento",
    "Faturamento por item",
    "Entradas e saídas",
  ];
  const linksForPendingBalances = ["Saldos em aberto", "Baixar dívida"];
  const linksForClients = ["Cadastrar/Modificar cliente", "Remover cliente"];
  const linksForSuppliers = [
    "Cadastrar/Modificar fornecedor",
    "Remover fornecedor",
  ];

  return (
    <div className="bg-gray-50 h-[100vh]">
      <HeaderComponent />
      <section className="h-full w-full flex items-center justify-start flex-col">
        <BaseAccordion
          type="multiple"
          collapsible="true"
          className="w-[50%] bg-gray-100 border-b-0 rounded-sm mt-5"
        >
          <AccordionItem value="value-1" className="px-5">
            <AccordionTrigger className="font-bold">
              Estoque
            </AccordionTrigger>
            {linksForStorageModule.map((description, idx) => (
              <AccordionContent className="text-gray-600" key={idx}>
                <Link className="hover:underline" to={description[1]}>{description[0]}</Link>
              </AccordionContent>
            ))}
          </AccordionItem>
        </BaseAccordion>
      </section>
    </div>
  );
};

export default Home;
