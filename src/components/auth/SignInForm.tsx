"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useAlert } from "@/context/AlertProvider";
import { useLogin } from "@/controller/query/auth/useAuthCredential";
import SpinnerLoader from "@/global/spinner/SpinnerLoader";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

export default function SignInForm() {
  const [cookies, setCookie] = useCookies();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const { mutate: _login, isPending: isLoggingIn } = useLogin();
  const { showAlert } = useAlert();

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert({
        variant: "error",
        title: "Champs obligatoires",
        message: `Veuillez remplir tous les champs`,
      });
      return;
    }
    _login({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 ">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800 dark:text-white/90">
          Connexion
        </h1>

        <div className="space-y-6">
          <div>
            <Label>
              Email <span className="text-error-500">*</span>
            </Label>
            <Input
              placeholder="info@gmail.com"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>
              Mot de passe <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="text-sm text-gray-700 dark:text-gray-400">
                Rester connecté
              </span>
            </div>
          </div>

          <Button className="w-full" size="sm" onClick={handleLogin}>
            {!isLoggingIn ? "Connexion" : <SpinnerLoader />}
          </Button>
        </div>
      </div>
    </div>
  );
}
