"use client";

import { ref, push } from "firebase/database";
import { auth, db } from "@/services/firebase/firebaseConfiguration";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { onAuthStateChanged } from "firebase/auth";

interface IMetas {
    id_usuario: string;
    tipo: string;
    data_conclusao: string;
    data_inicio: string;
    descricao: string;
    status: string;
    titulo: string;
}

export default function Home() {
    const { userAuth } = useAuthContext();
    const [authUser, setAuthUser] = useState(null);
    const [newMetas, setNewMetas] = useState<IMetas>({
        id_usuario: "",
        titulo: "",
        tipo: "",
        data_conclusao: "",
        data_inicio: "",
        descricao: "",
        status: "",
    });
    const [errors, setErrors] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setNewMetas((prevMetas) => ({
                    ...prevMetas,
                    id_usuario: user.uid,
                }));
            } else {
                setAuthUser(null);
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const validate = (): boolean => {
        const listaErro: string[] = [];
        const today = new Date().toISOString().split("T")[0];

        if (newMetas.data_inicio < today) {
            listaErro.push("A data de início não pode ser anterior ao dia atual.");
        }
        if (newMetas.data_conclusao < newMetas.data_inicio) {
            listaErro.push("A data de conclusão não pode ser anterior à data de início.");
        }
        if (newMetas.titulo.length < 5 || newMetas.titulo.length > 100) {
            listaErro.push("O título deve ter entre 5 e 100 caracteres.");
        }
        if (newMetas.descricao.length < 10 || newMetas.descricao.length > 500) {
            listaErro.push("A descrição deve ter entre 10 e 500 caracteres.");
        }

        setErrors(listaErro);
        return listaErro.length === 0;
    };

    const addNewMetas = () => {
        if (!newMetas.id_usuario) {
            console.error('User ID is undefined');
            return;
        }

        if (!validate()) {
            return;
        }

        push(ref(db, "/metas"), newMetas)
            .then(() => {
                setNewMetas({
                    id_usuario: authUser?.uid || "",
                    titulo: "",
                    tipo: "",
                    data_conclusao: "",
                    data_inicio: "",
                    descricao: "",
                    status: "",
                });
                router.push("/");
            })
            .catch((error) => {
                console.error('Error adding new meta:', error);
            });
    };

    return (
        <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
            <div className="max-w-md mx-auto">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addNewMetas();
                    }}
                >
                    <div className="mb-4">
                        <h2 className="text-center text-3xl mb-8 font-extrabold text-white">
                            Cadastrar Nova Meta!
                        </h2>

                        {errors.length > 0 && (
                            <div className="mb-4">
                                {errors.map((error, index) => (
                                    <p key={index} className="text-red-500">{error}</p>
                                ))}
                            </div>
                        )}

                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="tipo"
                        >
                            Tipo:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="tipo"
                            type="text"
                            placeholder="Tipo"
                            value={newMetas.tipo}
                            onChange={(e) =>
                                setNewMetas({ ...newMetas, tipo: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="titulo"
                        >
                            Título:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="titulo"
                            type="text"
                            placeholder="Título"
                            value={newMetas.titulo}
                            onChange={(e) =>
                                setNewMetas({ ...newMetas, titulo: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="data_inicio"
                        >
                            Data de Início:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="data_inicio"
                            type="date"
                            value={newMetas.data_inicio}
                            onChange={(e) =>
                                setNewMetas({ ...newMetas, data_inicio: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="data_conclusao"
                        >
                            Data Conclusão:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="data_conclusao"
                            type="date"
                            value={newMetas.data_conclusao}
                            onChange={(e) =>
                                setNewMetas({ ...newMetas, data_conclusao: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="descricao"
                        >
                            Descrição:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="descricao"
                            type="text"
                            placeholder="Descrição"
                            value={newMetas.descricao}
                            onChange={(e) =>
                                setNewMetas({ ...newMetas, descricao: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="status"
                        >
                            Status:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="status"
                            type="text"
                            placeholder="Status"
                            value={newMetas.status}
                            onChange={(e) =>
                                setNewMetas({ ...newMetas, status: e.target.value })
                            }
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Adicionar Meta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
