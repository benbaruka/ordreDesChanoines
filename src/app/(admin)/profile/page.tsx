"use client";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { useAuth } from "@/context/AuthProvider";
import { _getMe } from "@/controller/query/profile/profile.service";
import SpinLoader from "@/global/spinLoader/SpinLoader";

import { useQuery } from "@tanstack/react-query";

import React from "react";

export default function Profile() {
  const { user } = useAuth();
  const token = user?.data?.token?.token;
  const {
    data: Prof,
    isLoading: loaderProf,
    error: errorProf,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => _getMe(token!),
    enabled: !!token, // Active la requête uniquement si `token` est défini
    placeholderData: (prevData) => prevData,
  });

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        {loaderProf ? (
          <div className="flex h-[64vh] items-center justify-center">
            <SpinLoader />
          </div>
        ) : errorProf ? (
          <p className="text-red-500">Erreur lors du chargement du profil.</p>
        ) : (
          <div className="space-y-6">
            <UserMetaCard data={Prof!} />
            <UserInfoCard data={Prof!} />
            <UserAddressCard data={Prof!} />
          </div>
        )}
      </div>
    </div>
  );
}
