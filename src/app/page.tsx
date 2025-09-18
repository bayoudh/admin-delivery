"use client"
import React, { useState } from "react";
import loginImg from "@/assets/login.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { User } from "lucide-react";
export default function Login() {
  const { user, login, logout } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      await login(email, password); // 👈 await the async login
      console.log(User)
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full bg-sky-100 max-sm:h-max">
      <div className=" flex flex-col justify-center items-center ">
        <Image className=" object-cover" src={loginImg} alt="" />
      </div>

      <div className=" flex flex-col justify-center">
        <form
          onSubmit={signin}
          className="max-w-[400px] w-full mx-auto rounded-lg  p-8 px-8"
        >
          <h2 className="text-4xl dark:text-white font-bold text-center text-blue-400">
            SIGN IN
          </h2>
          <div className="flex flex-col text-blue-400 py-2">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg bg-white  mt-2 p-2 focus:border-sky-400 focus:bg-amber-50 focus:outline-none border-2"
            />
          </div>
          <div className="flex flex-col text-blue-400 py-2">
            <label>Password</label>
            <input
              className="p-2 rounded-lg bg-white mt-2 focus:border-blue-500 focus:bg-amber-50 focus:outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between text-blue-400 py-2">
            <p className="flex items-center">
              <input className="mr-2" type="checkbox" /> Remember Me
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full my-5 py-2 bg-sky-500 shadow-lg shadow-teal-500/50 hover:shadow-sky-500/40 text-white font-semibold rounded-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
