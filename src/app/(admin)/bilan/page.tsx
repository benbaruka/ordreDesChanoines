"use client";

import ComponentCard from "@/components/common/ComponentCard";
import ProductTable from "@/components/bilan/tables/BasicTableOne";
import { useAuth } from "@/context/AuthProvider";
import { _getBilan } from "@/controller/query/trans/trans.service";
import SpinLoader from "@/global/spinLoader/SpinLoader";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { _getYear } from "@/controller/query/dash/dash.service";

export interface ApidogModel {
  month?: string;
  year?: string;
}

const Home = () => {
  const { user } = useAuth();
  const token = user?.data?.token?.token;
  const currentYear = new Date().getFullYear();
  const { openModal } = useModal();
  const [year, setYear] = useState<number>(currentYear);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [filters, setFilters] = useState<ApidogModel>({
    year: new Date().getFullYear().toString(),
    month: "",
  });

  // Mois lisibles
  const months = [
    { value: "", label: "Tous les mois" },
    { value: "1", label: "Janvier" },
    { value: "2", label: "Février" },
    { value: "3", label: "Mars" },
    { value: "4", label: "Avril" },
    { value: "5", label: "Mai" },
    { value: "6", label: "Juin" },
    { value: "7", label: "Juillet" },
    { value: "8", label: "Août" },
    { value: "9", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" },
  ];

  // Génération dynamique des années (par ex. de 2020 à année courante + 5)
  const {
    data: yearData,
    isLoading: yearLoading,
    error: yearError,
  } = useQuery({
    queryKey: ["years", filters],
    queryFn: () => _getYear(token!),
    enabled: !!token,
  });

  const {
    data: trans,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["bilan", filters.year, filters.month], // 👈 ajoute month dans la clé
    queryFn: () => _getBilan(token!, filters),
    enabled: !!token,
  });

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard
          content={
            <div className="flex items-center justify-end">
              {/* Première ligne : boutons */}

              {/* Deuxième ligne : filtres Month + Year */}
              <div className="flex items-center gap-4">
                <Select
                  options={months}
                  placeholder="Mois"
                  onSearch={() => {}}
                  // value={filters.month!}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, month: value }))
                  }
                  className="w-full"
                />

                <Select
                  // value={filters.year}
                  onSearch={() => {}}
                  placeholder={`${currentYear}`}
                  onChange={(value) => {
                    setFilters((prev) => ({ ...prev, year: value }));
                    setYear(Number(value));
                    setDateRange(null);
                  }}
                  options={
                    yearData?.data?.map((y) => ({
                      value: y.toString(),
                      label: y.toString(),
                    })) || []
                  }
                  className="w-36"
                />
              </div>
            </div>
          }
        >
          {isLoading ? (
            <div className="flex h-[64vh] items-center justify-center">
              <SpinLoader />
            </div>
          ) : error ? (
            <p className="text-red-500">Erreur lors du chargement des trans.</p>
          ) : (
            <ProductTable data={trans?.data!} />
          )}
        </ComponentCard>
      </div>
    </div>
  );
};

export default Home;
