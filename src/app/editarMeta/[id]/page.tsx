"use client";

import { ref, onValue, update } from "firebase/database";
import { db } from "../../../services/firebase/firebaseConfiguration";
import { useEffect, useState } from "react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useParams, useRouter } from "next/navigation";

interface IUserParams extends Params {
  id: string;
}

interface IMetas {
  data_conclusao: string;
  data_inicio: string;
  descricao: string;
  status: string;
  tipo: string;
  titulo: string;
}

export default function Home() {
  const router = useRouter();
  const params: IUserParams = useParams();
  const { id } = params;
  const [meta, setMeta] = useState<IMetas>({
    data_conclusao: "",
    data_inicio: "",
    descricao: "",
    status: "",
    tipo: "",
    titulo: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const unsubscribe = onValue(ref(db, `/metas/${id}`), (querySnapShot) => {
        const metaData: IMetas = querySnapShot.val() || {};
        console.log(metaData);
        setMeta(metaData);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, [id]);

  const validate = () => {
    const errorsList: string[] = [];
    const today = new Date().toISOString().split("T")[0];

    if (!meta.titulo.trim()) {
      errorsList.push("O título da meta é obrigatório.");
    }
    if (!meta.tipo.trim()) {
      errorsList.push("O tipo da meta é obrigatório.");
    }
    if (!meta.data_inicio) {
      errorsList.push("A data de início da meta é obrigatória.");
    } else if (meta.data_inicio < today) {
      errorsList.push("A data de início não pode ser anterior ao dia atual.");
    }
    if (!meta.data_conclusao) {
      errorsList.push("A data de conclusão da meta é obrigatória.");
    } else if (meta.data_conclusao < meta.data_inicio) {
      errorsList.push("A data de conclusão não pode ser anterior à data de início.");
    }
    if (!meta.descricao.trim()) {
      errorsList.push("A descrição da meta é obrigatória.");
    }
    if (!meta.status.trim()) {
      errorsList.push("O status da meta é obrigatório.");
    }

    setErrors(errorsList);
    return errorsList.length === 0;
  };

  const editMetas = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    update(ref(db, `/metas/${id}`), meta);
    router.push("/");
  };

  return (
      <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
        <div className="max-w-md mx-auto">
          <form onSubmit={editMetas}>
            <div className="mb-4">
              <h2 className="text-center text-3xl mb-8 font-extrabold text-white">
                Editar Meta
              </h2>
              {errors.length > 0 && (
                  <div className="mb-4">
                    {errors.map((error, index) => (
                        <p key={index} className="text-red-500">{error}</p>
                    ))}
                  </div>
              )}
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="titulo">
                Título:
              </label>
              <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="titulo"
                  type="text"
                  placeholder="Título"
                  value={meta.titulo}
                  onChange={(e) => setMeta({...meta, titulo: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="tipo">
                Tipo:
              </label>
              <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="tipo"
                  type="text"
                  placeholder="Tipo"
                  value={meta.tipo}
                  onChange={(e) => setMeta({...meta, tipo: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="data_inicio">
                Data de Início:
              </label>
              <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="data_inicio"
                  type="date"
                  placeholder="Data de Início"
                  value={meta.data_inicio}
                  onChange={(e) => setMeta({...meta, data_inicio: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="data_conclusao">
                Data de Conclusão:
              </label>
              <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="data_conclusao"
                  type="date"
                  placeholder="Data de Conclusão"
                  value={meta.data_conclusao}
                  onChange={(e) => setMeta({...meta, data_conclusao: e.target.value})}
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="descricao">
                Descrição:
              </label>
              <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="descricao"
                  type="text"
                  placeholder="Descrição"
                  value={meta.descricao}
                  onChange={(e) => setMeta({...meta, descricao: e.target.value})}
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="status">
                Status:
              </label>
              <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="status"
                  type="text"
                  placeholder="Status"
                  value={meta.status}
                  onChange={(e) => setMeta({...meta, status: e.target.value})}
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
              >
                Editar
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
