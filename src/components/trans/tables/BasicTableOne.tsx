"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import DateFormatter from "@/utils/dateFns";
import { DaumResponseTrans, ResponseUpdateTrans } from "@/types";
import { FaEdit } from "react-icons/fa";
import { useModal } from "@/hooks/useModal";
import { useAlert } from "@/context/AlertProvider";
import { Modal } from "@/components/ui/modal";
import { CalenderIcon } from "@/icons";
import "flatpickr/dist/themes/light.css";
import Flatpickr from "react-flatpickr";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useQuery } from "@tanstack/react-query";
import { _getActivity } from "@/controller/query/activity/activity.service";
import { useAuth } from "@/context/AuthProvider";
import Select from "@/components/form/Select";
import { useUpdateTransaction } from "@/controller/query/trans/useTrans";
import SpinnerLoader from "@/global/spinner/SpinnerLoader";

export default function ProductTable({ data }: { data: DaumResponseTrans[] }) {
  const { openModal, closeModal, isOpen } = useModal();
  const { showAlert } = useAlert();
  const { user } = useAuth();
  const token = user?.data?.token?.token;
  const [selectedTx, setSelectedTx] = useState<DaumResponseTrans | null>(null);
  const [activity, setActivity] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [rapportDate, setRapportDate] = useState<Date | null>(null);
  const { mutate: createTransaction, isPending } = useUpdateTransaction(token!);

  const { data: activities } = useQuery({
    queryKey: ["activities"],
    queryFn: () => _getActivity(token!),
    enabled: !!token,
  });
  const activityOptions =
    activities?.data?.data?.map((a: any) => ({
      value: a?.id,
      label: a?.name,
    })) ?? [];

  // Ouvrir le modal et charger les infos
  const handleOpenUpdate = (tx: DaumResponseTrans) => {
    setSelectedTx(tx);
    setActivity(tx?.activity?.id || "");
    setAmount(tx.amount);
    setDesignation(tx.designation || "");
    setDescription(tx.comment || "");
    setRapportDate(tx.rapport_at ? new Date(tx.rapport_at) : null);
    closeModal();
  };
  const formatDateTime = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    return `${day}-${month}-${year}`;
  };

  // Soumettre la mise à jour
  const handleUpdate = () => {
    if (!selectedTx) return;
    if (!rapportDate) return; // vérifier que la date est sélectionnée

    const payload: ResponseUpdateTrans = {
      activity_id: activity,
      amount: Number(amount),
      comment: description,
      designation,
      rapport_at: formatDateTime(rapportDate!), // conversion Date → string
    };

    createTransaction(
      { credentials: payload, id: selectedTx.id },
      {
        onSuccess: () => {
          setActivity("");
          setAmount(0);
          setDescription("");
          setDesignation("");
          setRapportDate(null); // reset Date
          closeModal();
        },
        onError: (error) => {
          console.error(error);
          showAlert({
            variant: "error",
            title: "Erreur",
            message: `${error}`,
          });
        },
      },
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            {/* Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Secteur
                </TableCell>
                <TableCell className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Description
                </TableCell>
                <TableCell className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Montant
                </TableCell>
                <TableCell className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Type
                </TableCell>
                <TableCell className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  REF
                </TableCell>
                <TableCell className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Date
                </TableCell>
                <TableCell className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Émetteur
                </TableCell>
                <TableCell className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Modifier
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data?.map((tx) => (
                <TableRow key={tx.id}>
                  {/* Action */}
                  <TableCell className="text-md px-5 py-3 text-start font-bold uppercase text-gray-800 dark:text-white/90">
                    {tx?.activity?.name}
                  </TableCell>

                  {/* Description */}
                  <TableCell className="w-[200px] px-5 py-2 text-start">
                    <p className="m-0 font-semibold text-gray-800 dark:text-white">
                      {tx.comment}
                    </p>
                    <p className="m-0 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {tx.designation}
                    </p>
                  </TableCell>

                  {/* Montant */}
                  <TableCell className="px-5 py-3 text-start">
                    <Badge color="primary">
                      {tx.amount.toLocaleString()} $
                    </Badge>
                  </TableCell>

                  {/* Type */}
                  <TableCell className="px-5 py-3 text-start text-sm text-gray-600 dark:text-gray-400">
                    <Badge
                      color={
                        tx.type === 1
                          ? "success"
                          : tx.type === 0
                            ? "error"
                            : "info"
                      }
                    >
                      {tx.type === 1
                        ? "Entrée"
                        : tx.type === 0
                          ? "Sortie"
                          : "Autre"}
                    </Badge>
                  </TableCell>

                  {/* Rapport */}
                  <TableCell className="px-5 py-3 text-start text-sm uppercase text-gray-600 dark:text-gray-400">
                    {tx.id}
                  </TableCell>

                  {/* Mise à jour */}
                  <TableCell className="px-5 py-3 text-start text-sm text-gray-600 dark:text-gray-400">
                    {DateFormatter.formatDateLong(tx.rapport_at)}
                  </TableCell>

                  {/* Émetteur */}
                  <TableCell className="px-5 py-3 text-start text-sm text-gray-600 dark:text-gray-400">
                    {tx?.user?.full_name}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-end text-sm text-gray-600 dark:text-gray-400">
                    <FaEdit
                      size={20}
                      className="cursor-pointer text-blue-500"
                      onClick={() => {
                        handleOpenUpdate(tx);
                        openModal();
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-2xl">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Modifier la transaction
              </h2>

              {/* Ligne 1 : Activité + Montant */}
              <div className="grid grid-cols-2 items-center gap-4">
                <div className="space-y-3">
                  <Label className="">Activité</Label>

                  <select
                    value={activity} // id actuel de l'activité sélectionnée
                    onChange={(e) => setActivity(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">-- Sélectionner une activité --</option>
                    {activityOptions.length === 0 ? (
                      <option value="">-- Chargement --</option>
                    ) : (
                      activityOptions.map((a: any) => (
                        <option key={a.value} value={a.value}>
                          {a.label}
                        </option>
                      ))
                    )}
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
              <div className="space-y-3">
                <Label>Description</Label>
                <textarea
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  rows={3}
                />
              </div>

              {/* Ligne 3 : Description + Date rapport */}
              <div className="grid grid-cols-2 items-center gap-4">
                <div className="space-y-3">
                  <Label className="mb-4">Libele</Label>
                  <Input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Date du rapport</Label>
                  <div className="flatpickr-wrapper relative w-full">
                    <Flatpickr
                      value={rapportDate || undefined}
                      onChange={(dates) => setRapportDate(dates[0] || null)}
                      options={{ dateFormat: "d/m/Y" }}
                      placeholder="Sélectionner une date"
                      className="h-11 w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <CalenderIcon />
                    </span>
                  </div>
                </div>
              </div>

              {/* Bouton */}
              <div className="flex justify-end">
                <Button onClick={handleUpdate}>
                  {isPending ? <SpinnerLoader /> : "Modifier"}
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}
