"use client";

import React from "react";
import signUp from "../../services/firebase/auth/signUp";
import { useRouter } from "next/navigation";

function Page() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const router = useRouter();

    const handleForm = async (event: React.FormEvent) => {
        event.preventDefault();

        const { result, error } = await signUp(email, password);

        if (error) {
            return console.log(error);
        }

        // else successful
        console.log(result);
        return router.push("/signin");
    };

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col justify-center items-center">
            <section className="bg-white p-8 rounded-lg shadow-lg text-black">
                <h1 className="text-3xl font-bold mb-4">SignUp</h1>
                <form onSubmit={handleForm} className="space-y-4">
                    <label htmlFor="email" className="block">
                        <p>Email</p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            type="email"
                            name="email"
                            id="email"
                            className="w-full px-4 py-2 rounded border-gray-300 focus:outline-none focus:border-indigo-500"
                            placeholder="example@mail.com"
                        />
                    </label>
                    <label htmlFor="password" className="block">
                        <p>Password</p>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            type="password"
                            name="password"
                            id="password"
                            className="w-full px-4 py-2 rounded border-gray-300 focus:outline-none focus:border-indigo-500"
                            placeholder="password"
                        />
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sign Up
                    </button>
                    <button
                        type="button"
                        className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => router.push("/login")}
                    >
                        Sign In
                    </button>
                </form>
            </section>
        </div>
    );
}

export default Page;
