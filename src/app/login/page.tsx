"use client";

import { useState, FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import signIn from "../../services/firebase/auth/signIn";
import { useRouter } from "next/navigation";

function SignIn() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleForm = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { result, error } = await signIn(email, password);

      if (error) {
        const firebaseError = error as FirebaseError;
        if (firebaseError.message) {
          console.log(firebaseError.message);
          throw new Error(firebaseError.message);
        } else {
          console.log("Unknown Error:", firebaseError);
          throw new Error("Unknown Error");
        }
      }

      console.log(result);
      return router.push("/");
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
      <div className="min-h-screen bg-gray-800 flex flex-col justify-center items-center">
        <section className="bg-white text-black p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">SignIn</h1>
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
              Sign In
            </button>
            <button
                type="button"
                className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => router.push("/registrar")}
            >
              Sign Up
            </button>
          </form>
        </section>
      </div>
  );
}

export default SignIn;