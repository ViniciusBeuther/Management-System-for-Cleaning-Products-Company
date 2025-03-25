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
    ["Cadastrar produto", "/products"],
    ["Consultar produtos cadastrados", "/products/consult"],
    ["Consultar estoque", "/storage"],
    ["Recebimento de Produtos", "/productReceivingForm"],
  ];
  const linksForOrders = [
    ["Emitir pedido", "/issueOrder"],
    ["Cadastrar novo pedido", "/newOrderForm"],
    ["Histórico de pedidos", "/orderHistory"],
    ["Consultar pedidos em aberto", "/unpaidOrders"],
    ["Emitir pedido em PDF", "/issueDocumentOrder"],
  ];
  const linksForCosts = [
    ["Fluxo de caixa", "/cashflow"],
    ["Precificação de produto", "/productPricing"],
    ["Custos por produto", "/costsPerProduct"],
  ];
  const linksForReports = [
    ["Faturamento", "/revenueReport"],
    ["Faturamento por item", "/revenuePerItemReport"],
    ["Entradas e saídas", "/cashflowReport"],
  ];
  const linksForPendingBalances = [["Saldos em aberto", "/pendingBalance"], ["Baixar dívida", "/payoffDebit"]];
  const linksForClients = [["Cadastrar/Modificar cliente", "/clientForm"], ["Remover cliente", "/removeClient"]];
  const linksForSuppliers = [
    ["Cadastrar/Modificar fornecedor", "/supplierForm"],
    ["Remover fornecedor", "/removeSupplier"],
  ];

  return (
    <div className="bg-gray-50 h-full">
      <HeaderComponent />
      <section className="w-full bg-gray-50 flex items-center justify-start flex-col pb-2">
        <BaseAccordion
          type="multiple"
          collapsible="true"
          className="w-[50%] bg-gray-100 border-b-0 rounded-sm mt-5"
        >
          <AccordionItem value="value-1" className="px-5">
            <AccordionTrigger className="font-bold">Estoque</AccordionTrigger>
            {linksForStorageModule.map((description, idx) => (
              <AccordionContent className="text-gray-600" key={idx}>
                <Link className="hover:underline" to={description[1]}>
                  {description[0]}
                </Link>
              </AccordionContent>
            ))}
          </AccordionItem>
        </BaseAccordion>
        <BaseAccordion
          type="multiple"
          collapsible="true"
          className="w-[50%] bg-gray-100 border-b-0 rounded-sm mt-5"
        >
          <AccordionItem value="value-1" className="px-5">
            <AccordionTrigger className="font-bold">Pedidos</AccordionTrigger>
            {linksForOrders.map((description, idx) => (
              <AccordionContent className="text-gray-600" key={idx}>
                <Link className="hover:underline" to={description[1]}>
                  {description[0]}
                </Link>
              </AccordionContent>
            ))}
          </AccordionItem>
        </BaseAccordion>
        <BaseAccordion
          type="multiple"
          collapsible="true"
          className="w-[50%] bg-gray-100 border-b-0 rounded-sm mt-5"
        >
          <AccordionItem value="value-1" className="px-5">
            <AccordionTrigger className="font-bold">Custos</AccordionTrigger>
            {linksForCosts.map((description, idx) => (
              <AccordionContent className="text-gray-600" key={idx}>
                <Link className="hover:underline" to={description[1]}>
                  {description[0]}
                </Link>
              </AccordionContent>
            ))}
          </AccordionItem>
        </BaseAccordion>
        <BaseAccordion
          type="multiple"
          collapsible="true"
          className="w-[50%] bg-gray-100 border-b-0 rounded-sm mt-5"
        >
          <AccordionItem value="value-1" className="px-5">
            <AccordionTrigger className="font-bold">
              Relatórios
            </AccordionTrigger>
            {linksForReports.map((description, idx) => (
              <AccordionContent className="text-gray-600" key={idx}>
                <Link className="hover:underline" to={description[1]}>
                  {description[0]}
                </Link>
              </AccordionContent>
            ))}
          </AccordionItem>
        </BaseAccordion>
        <BaseAccordion
          type="multiple"
          collapsible="true"
          className="w-[50%] bg-gray-100 border-b-0 rounded-sm mt-5"
        >
          <AccordionItem value="value-1" className="px-5">
            <AccordionTrigger className="font-bold">Pendentes</AccordionTrigger>
            {linksForPendingBalances.map((description, idx) => (
              <AccordionContent className="text-gray-600" key={idx}>
                <Link className="hover:underline" to={description[1]}>
                  {description[0]}
                </Link>
              </AccordionContent>
            ))}
          </AccordionItem>
        </BaseAccordion>
        <BaseAccordion
          type="multiple"
          collapsible="true"
          className="w-[50%] bg-gray-100 border-b-0 rounded-sm mt-5"
        >
          <AccordionItem value="value-1" className="px-5">
            <AccordionTrigger className="font-bold">Clientes</AccordionTrigger>
            {linksForClients.map((description, idx) => (
              <AccordionContent className="text-gray-600" key={idx}>
                <Link className="hover:underline" to={description[1]}>
                  {description[0]}
                </Link>
              </AccordionContent>
            ))}
          </AccordionItem>
        </BaseAccordion>
        <BaseAccordion
          type="multiple"
          collapsible="true"
          className="w-[50%] bg-gray-100 border-b-0 rounded-sm mt-5"
        >
          <AccordionItem value="value-1" className="px-5">
            <AccordionTrigger className="font-bold">
              Fornecedores
            </AccordionTrigger>
            {linksForSuppliers.map((description, idx) => (
              <AccordionContent className="text-gray-600" key={idx}>
                <Link className="hover:underline" to={description[1]}>
                  {description[0]}
                </Link>
              </AccordionContent>
            ))}
          </AccordionItem>
        </BaseAccordion>
      </section>
    </div>
  );
};

export default Home;
