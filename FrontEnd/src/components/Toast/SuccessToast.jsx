import { Check } from "lucide-react";

const SuccessToast = ({ message, onClose }) => {

  return (
    <article className="fixed bottom-4 right-4 z-50">
      <div className="flex justify-start items-center gap-4 bg-green-600 text-white rounded-lg shadow-lg px-4 py-3 w-[300px] animate-fade-in-out">
        <section>
          <Check height={20} width={20} />
        </section>
        <section>
          <h3 className="font-bold m-0">Sucesso</h3>
          <p className="text-sm mt-0">{message}</p>
        </section>
      </div>
    </article>
  );
}

export default SuccessToast;