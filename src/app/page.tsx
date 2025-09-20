"use client";

import React, { useEffect, useState } from "react";
import loginImg from "@/assets/login.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../lib/store/auth";

export default function Login() {
  const {  token,login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
 useEffect(() => {
    if (token) {
      router.push("/dashboard"); // 👈 redirect if not logged in
    }
  }, [token, router]);
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  };

  const signin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      await login(email, password); // await login from store
    
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
      <div className="flex flex-col justify-center items-center">
        <Image className="object-cover" src={loginImg} alt="" />
      </div>

      <div className="flex flex-col justify-center">
        <form
          onSubmit={signin}
          className="max-w-[400px] w-full mx-auto rounded-lg p-8 px-8"
        >
          <h2 className="text-4xl dark:text-white font-bold text-center text-blue-400">
            SIGN IN
          </h2>

          {/* Email */}
          <div className="flex flex-col text-blue-400 py-2">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="rounded-lg bg-white mt-2 p-2 focus:border-sky-400 focus:bg-amber-50 focus:outline-none border-2"
            />
            {emailError && (
              <span className="text-red-500 text-sm">{emailError}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col text-blue-400 py-2">
            <label>Password</label>
            <input
              className="p-2 rounded-lg bg-white mt-2 focus:border-blue-500 focus:bg-amber-50 focus:outline-none"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <span className="text-red-500 text-sm">{passwordError}</span>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex justify-between text-blue-400 py-2">
            <p className="flex items-center">
              <input className="mr-2" type="checkbox" /> Remember Me
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading || !!emailError || !!passwordError || !email || !password
            }
            className="w-full my-5 py-2 bg-sky-500 shadow-lg shadow-teal-500/50 hover:shadow-sky-500/40 text-white font-semibold rounded-lg disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
