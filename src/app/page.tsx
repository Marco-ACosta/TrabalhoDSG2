"use client";

import { ref, onValue, remove } from "firebase/database";
import { db } from "@/services/firebase/firebaseConfiguration";
import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/services/firebase/firebaseConfiguration";
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

interface IMetas {
    [key: string]: {
        tipo: string;
        data_conclusao: string;
        data_inicio: string;
        descricao: string;
        status: string;
        titulo: string;
        id_usuario: string;
    };
}

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [metas, setMetas] = useState<IMetas>({});
    const { userAuth } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Usuário logado: ", user.uid);
                fetchMetas(user.uid);
            } else {
                console.log("Usuário deslogado");
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchMetas = (uid: string) => {
        const metasRef = ref(db, `/metas`);
        onValue(metasRef, (querySnapShot) => {
            const metasData: IMetas = querySnapShot.val() || {};
            const metasUsuario: IMetas = {};
            Object.keys(metasData).forEach((metaId) => {
                if (metasData[metaId].id_usuario === uid) {
                    metasUsuario[metaId] = metasData[metaId];
                }
            });
            setMetas(metasUsuario);
            setLoading(false);
        });
    };
    const handleLogout = () => {
        auth.signOut().then(() => {
            router.push("/login");
        }).catch((error) => {
            console.error("Error signing out: ", error);
        });
    };
    const clearUser = (metaId: string) => {
        const metaRef = ref(db, `/metas/${metaId}`);
        remove(metaRef).then(() => {
            console.log(`Meta ${metaId} removida`);
            setMetas((prevMetas) => {
                const newMetas = { ...prevMetas };
                delete newMetas[metaId];
                return newMetas;
            });
        }).catch((error) => {
            console.error("Erro ao remover meta: ", error);
        });
    };

    return (

        <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 m-12">
                <nav className="bg-gray-800 py-4 fixed top-0 left-0 w-full z-50">
                    <div className="container mx-auto flex justify-between items-center text-white">
                        <div>
                            Suas Metas
                        </div>
                        <div>
                            <Link href={`criarMetas/`}>
                                <button
                                    className="bg-green-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                    Criar Meta
                                </button>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>
                {!loading &&
                    Object.keys(metas).map((metaId) => (
                        <div key={metaId} className="relative py-3">
                            <div className="max-w-md mx-auto">
                                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                                        {metas[metaId].titulo.toUpperCase()}
                                    </h2>
                                    <div className="my-4">
                                        <p className={"text-black"}>{`Nome: ${metas[metaId].titulo}`}</p>
                                        <p className="text-black">{`Tipo: ${metas[metaId].tipo}`}</p>
                                        <p className="text-black">{`Data de Início: ${metas[metaId].data_inicio}`}</p>
                                        <p className="text-black">{`Data de Conclusão: ${metas[metaId].data_conclusao}`}</p>
                                        <p className="text-black">{`Descrição: ${metas[metaId].descricao}`}</p>
                                        <p className="text-black">{`Status: ${metas[metaId].status}`}</p>

                                        <div className="flex justify-center space-x-4 mt-4">
                                            <Link href={`editarMeta/${metaId}`}>
                                                <button
                                                    className="bg-green-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                                    Editar Meta
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => clearUser(metaId)}
                                                className="bg-red-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
