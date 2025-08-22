"use client";
import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { ResponseMe } from "@/types";
import { FiEyeOff } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { useUpdateChangePwd } from "@/controller/query/profile/useProfile";
import { useAuth } from "@/context/AuthProvider";
import { useAlert } from "@/context/AlertProvider";
import SpinnerLoader from "@/global/spinner/SpinnerLoader";

export default function UserAddressCard({ data }: { data: ResponseMe }) {
  const { isOpen, openModal, closeModal } = useModal();
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [pwd, setPwd] = useState<string>("");
  const [confpwd, setConfPwd] = useState<string>("");

  const [oldpwd, setOldPwd] = useState<string>("");
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const token = user?.data?.token?.token;
  const { mutate: _create, isPending } = useUpdateChangePwd(token!);

  const handleSave = async () => {
    if (!pwd || !oldpwd) {
      return showAlert({
        variant: "error",
        title: "Opération échouée",
        message: "toute les champs sont requis.",
      });
    }
    if (pwd !== confpwd) {
      return showAlert({
        variant: "error",
        title: "Erreur de confirmation",
        message: "Le mot de passe et sa confirmation ne correspondent pas.",
      });
    }

    try {
      await _create({
        credentials: {
          email: data?.data?.email,
          password: pwd,
          hold_password: oldpwd,
          password_confirmation: confpwd,
        },
      });

      setPwd("");
      setOldPwd("");
      setConfPwd("");
    } catch (error) {
      setPwd("");
      setOldPwd("");
      setConfPwd("");
      showAlert({
        variant: "error",
        title: "Erreur",
        message: `${error}`,
      });
    }
  };
  return (
    <>
      <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Changer mot de passe
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Ancien mot de passe
                </p>
                <div className="relative">
                  <Input
                    value={oldpwd}
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Nouveau mot de passe"
                    className="pr-10"
                    onChange={(e) => setOldPwd(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    {!showOldPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <BsEye size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Nouveau mot de passe
                </p>
                <div className="relative">
                  <Input
                    value={pwd}
                    type={showPassword ? "text" : "password"}
                    placeholder="Nouveau mot de passe"
                    className="pr-10"
                    onChange={(e) => setPwd(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    {!showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <BsEye size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Confirmation mot de passe
                </p>
                <div className="relative">
                  <Input
                    value={confpwd}
                    type={showConfPassword ? "text" : "password"}
                    placeholder="Nouveau mot de passe"
                    error={confpwd !== pwd}
                    className={`pr-10`}
                    onChange={(e) => setConfPwd(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    {!showConfPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <BsEye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            {isPending ? <SpinnerLoader /> : "Sauvegarder"}
          </button>
        </div>
      </div>
    </>
  );
}
