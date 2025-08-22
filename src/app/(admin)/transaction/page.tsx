"use client";
import ComponentCard from "@/components/common/ComponentCard";

import ProductTable from "@/components/trans/tables/BasicTableOne";
import { useAuth } from "@/context/AuthProvider";
import { _getTrans } from "@/controller/query/trans/trans.service";
import SpinLoader from "@/global/spinLoader/SpinLoader";
import { useQuery } from "@tanstack/react-query";

import React, { useState } from "react";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { _getActivity } from "@/controller/query/activity/activity.service";
import { _getAllUser } from "@/controller/query/users/users.service";
import { useModal } from "@/hooks/useModal";
import { useAlert } from "@/context/AlertProvider";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import { useTransaction } from "@/controller/query/trans/useTrans";
import SpinnerLoader from "@/global/spinner/SpinnerLoader";
import { CalenderIcon } from "@/icons";
import "flatpickr/dist/themes/light.css";
import "dayjs/locale/fr"; // français
import "antd/dist/reset.css";
import Flatpickr from "react-flatpickr";
import Pagination from "@/components/Activity/tables/Pagination";

dayjs.locale("fr");
const { RangePicker } = DatePicker;
const Home = () => {
  const { user } = useAuth();
  const token = user?.data?.token?.token;
  const { openModal, closeModal, isOpen } = useModal();
  const { showAlert } = useAlert();
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [minAmount, setMinAmount] = useState<number | "">("");
  const [maxAmount, setMaxAmount] = useState<number | "">("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null,
  );

  const options = [
    { value: "all", label: "Tout" },
    { value: "0", label: "Sortie" },
    { value: "1", label: "Entrée" },
  ];

  const handleSearch = (q: string) => {
    console.log("Recherche:", q);
    // Ici tu peux filtrer tes données ou appeler une API
  };

  const handleChange = (value: string) => {
    setSelectedType(value);
    console.log("Type sélectionné:", value);
    // Ici tu peux filtrer ton tableau en fonction du type
  };

  const limit = 10;
  const [activityId, setActivityId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const getQueryParams = () => {
    const params: any = {};
    if (selectedType !== "all") params.type = selectedType;
    if (searchText) params.q = searchText;
    if (minAmount !== "") params.min_amount = minAmount;
    if (maxAmount !== "") params.max_amount = maxAmount;
    if (dateRange) {
      params.start_at = dateRange[0].format("YYYY-MM-DD");
      params.end_at = dateRange[1].format("YYYY-MM-DD");
    }
    if (activityId) params.activity_id = activityId;
    if (userId) params.user_id = userId;
    if (limit) params.limit = limit;
    if (page) params.page = page;
    return params;
  };

  const {
    data: trans,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "trans",
      selectedType,
      searchText,
      minAmount,
      maxAmount,
      dateRange,
      activityId,
      userId,
      page,
      limit,
    ],
    queryFn: () => _getTrans(token!, getQueryParams()),
    enabled: !!token,
  });
  const handleDateChange: RangePickerProps["onChange"] = (dates) => {
    if (!dates) {
      setDateRange(null);
    } else {
      setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs]);
    }
    refetch();
  };
  //select

  const { data: activities } = useQuery({
    queryKey: ["Activity"],
    queryFn: () => _getActivity(token!),
    enabled: !!token,
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => _getAllUser(token!),
    enabled: !!token,
  });
  // Transformation des données pour Antd Select
  const activityOptions = [
    { value: "", label: "Toutes les activités" }, // option par défaut
    ...(activities?.data?.data?.map((a: any) => ({
      value: a?.id, // ou a?.uuid si c’est ça ta clé
      label: a?.name,
    })) ?? []),
  ];

  const userOptions = [
    { value: "", label: "Tous les utilisateurs" }, // option par défaut
    ...(users?.data?.data?.map((u) => ({
      value: u?.id,
      label: u?.full_name, // adapte selon ton API
    })) ?? []),
  ];

  // const meta = stockData?.transactions;
  const [showOutput, setShowOutput] = useState(false);
  const handleCancelDelete = () => {
    setShowOutput(false);
  };
  const meta = trans?.data?.meta;
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  //add

  // ----- États pour champs -----
  const [activityIdAdd, setActivityIdAdd] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [designation, setDesignation] = useState("");
  const [rapportAt, setRapportAt] = useState("");
  const { mutate: createTransaction, isPending } = useTransaction(token!);
  const [flatpickrDate, setFlatpickrDate] = useState<Date | null>(null);

  const handleDateChanges = (dates: Date[]) => {
    const selectedDate = dates[0];
    if (!selectedDate) return;

    const day = String(selectedDate.getDate()).padStart(2, "0");
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const year = selectedDate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`; // dd-MM-yyyy

    setFlatpickrDate(selectedDate); // valeur pour Flatpickr
    setRapportAt(formattedDate); // valeur formatée pour ton API
  };
  const handleCreate = async (type: number) => {
    if (!activityIdAdd || !amount || !designation || !rapportAt) {
      return showAlert({
        variant: "error",
        title: "Erreur",
        message: `Veuillez remplir tous les champs obligatoires !`,
      });
    }

    createTransaction(
      {
        transactions: [
          {
            activity_id: activityIdAdd,
            amount,
            comment: description,
            designation,
            rapport_at: rapportAt,
            type, // 1 = Entrée, 0 = Sortie
          },
        ],
      },
      {
        onSuccess: () => {
          // reset champs et fermer modals
          setActivityId("");
          setAmount("");
          setDescription("");
          setDesignation("");
          setRapportAt("");
          closeModal();
          setShowOutput(false);
        },
        onError: (error) => {
          console.error(error);
          return showAlert({
            variant: "error",
            title: "Erreur",
            message: `${error}`,
          });
        },
      },
    );
  };
  return (
    <div>
      <>
        <div className="space-y-6">
          <ComponentCard
            content={
              <>
                {/* Première ligne : Search + boutons */}
                <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                  {/* Search */}
                  <div className="relative w-full lg:w-1/2">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                      <svg
                        className="fill-gray-500 dark:fill-gray-400"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                        />
                      </svg>
                    </span>
                    <Input
                      type="text"
                      placeholder="Rechercher par description de la transaction"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
                    />
                  </div>

                  {/* Boutons rapides */}
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={openModal}>Entrée caisse</Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => setShowOutput(true)}
                    >
                      Sortie caisse
                    </Button>
                  </div>
                </div>

                {/* Deuxième ligne : autres filtres */}
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                  {/* Type */}
                  <Select
                    options={options}
                    onSearch={handleSearch}
                    onChange={handleChange}
                    placeholder="Sélectionner le type"
                    defaultValue="all"
                  />

                  {/* Activity ID */}
                  <Select
                    options={activityOptions}
                    placeholder="Sélectionner une activité"
                    onSearch={handleSearch}
                    onChange={(value) => setActivityId(value)}
                    className="w-full"
                  />

                  {/* User ID */}
                  <Select
                    options={userOptions}
                    placeholder="Sélectionner un utilisateur"
                    onSearch={handleSearch}
                    // value={userId}
                    onChange={(value) => setUserId(value)}
                    className="w-full"
                  />

                  {/* Montants min / max */}
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min ($)"
                      className="w-full"
                      onChange={(e) => setMinAmount(Number(e.target.value))}
                    />
                    <Input
                      type="number"
                      placeholder="Max ($)"
                      className="w-full"
                      onChange={(e) => setMaxAmount(Number(e.target.value))}
                    />
                  </div>

                  {/* Date range */}
                  <RangePicker
                    value={dateRange as any}
                    onChange={handleDateChange}
                    format="YYYY-MM-DD"
                    className="w-full"
                  />
                </div>
              </>
            }
          >
            {isLoading ? (
              <div className="flex h-[64vh] items-center justify-center">
                <SpinLoader />
              </div>
            ) : error ? (
              <p className="text-red-500">
                Erreur lors du chargement des trans.
              </p>
            ) : (
              <>
                {" "}
                <ProductTable data={trans?.data?.data!} />
                <div className="flex w-full justify-center">
                  {meta && (
                    <Pagination
                      currentPage={meta.currentPage}
                      totalPages={meta.lastPage}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>{" "}
              </>
            )}
          </ComponentCard>
        </div>
      </>
      {/* Modal Entrée */}
      <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-2xl">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Ajouter une transaction (Entrée)
          </h2>

          {/* Ligne 1 : Activité et Montant */}
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="space-y-3">
              <Label>Activité</Label>
              <select
                value={activityIdAdd}
                onChange={(e) => setActivityIdAdd(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring dark:bg-gray-800 dark:text-white"
              >
                <option value="">-- Sélectionner une activité --</option>
                {activityOptions.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Label>Montant</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Ligne 3 : Description et Date rapport */}
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="space-y-3">
              <Label className="mb-4">Description</Label>
              <Input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label>Date du rapport</Label>
              <div className="flatpickr-wrapper relative w-full">
                <Flatpickr
                  name="date_of_issue"
                  value={flatpickrDate || undefined}
                  onChange={handleDateChanges}
                  options={{
                    dateFormat: "d/m/Y",
                  }}
                  placeholder="Sélectionner une date"
                  className="h-11 w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <CalenderIcon />
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <Label>Désignation</Label>
            <textarea
              placeholder="Désignation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              rows={4}
            />
          </div>

          {/* Note */}
          <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            ⚠️ Cette transaction <b>ne peut pas être supprimée</b> une fois
            émise.
          </div>

          {/* Bouton */}
          <div className="flex justify-end">
            <Button onClick={() => handleCreate(1)}>
              {isPending ? <SpinnerLoader /> : "Ajouter Entrée"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Sortie */}
      <Modal
        isOpen={showOutput}
        onClose={handleCancelDelete}
        className="m-4 max-w-2xl"
      >
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Ajouter une transaction (Sortie)
          </h2>

          {/* Ligne 1 : Activité et Montant */}
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="space-y-3">
              <Label>Activité</Label>
              <select
                value={activityIdAdd}
                onChange={(e) => setActivityIdAdd(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring dark:bg-gray-800 dark:text-white"
              >
                <option value="">-- Sélectionner une activité --</option>
                {activityOptions.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Label>Montant</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Ligne 2 : Désignation */}

          {/* Ligne 3 : Description et Date rapport */}
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="space-y-3">
              <Label className="mb-4">Description</Label>
              <Input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label>Date du rapport</Label>
              <div className="flatpickr-wrapper relative w-full">
                <Flatpickr
                  name="date_of_issue"
                  value={flatpickrDate || undefined}
                  onChange={handleDateChanges}
                  options={{
                    dateFormat: "d/m/Y",
                  }}
                  placeholder="Sélectionner une date"
                  className="h-11 w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <CalenderIcon />
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <Label>Désignation</Label>
            <textarea
              placeholder="Désignation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              rows={4}
            />
          </div>

          {/* Note */}
          <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            ⚠️ Cette transaction <b>ne peut pas être supprimée</b> une fois
            émise.
          </div>

          {/* Bouton */}
          <div className="flex justify-end">
            <Button onClick={() => handleCreate(0)}>
              {isPending ? <SpinnerLoader /> : "Ajouter Sortie"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
