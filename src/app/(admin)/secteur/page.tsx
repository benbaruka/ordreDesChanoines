"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ComponentCard from "@/components/common/ComponentCard";
import BasicTableOne from "@/components/Activity/tables/BasicTableOne";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/context/AuthProvider";
import { useModal } from "@/hooks/useModal";
import { _getActivity } from "@/controller/query/activity/activity.service";
import SpinLoader from "@/global/spinLoader/SpinLoader";
import SpinnerLoader from "@/global/spinner/SpinnerLoader";
import { useAlert } from "@/context/AlertProvider";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

import { useActivity } from "@/controller/query/activity/useActivity";
import Pagination from "@/components/Activity/tables/Pagination";

export default function BasicTables() {
  const { user } = useAuth();
  const { openModal, closeModal, isOpen } = useModal();
  const { showAlert } = useAlert();

  const token = user?.data?.token?.token;
  const [search, setSearch] = useState<string>("");
  const [name, setName] = useState<string>();
  const [desc, setDesc] = useState<string>();

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const {
    data: Activity,
    isLoading: loaderActivity,
    error: errorActivity,
  } = useQuery({
    queryKey: ["Activity", search, page, limit],
    queryFn: () => _getActivity(token!, { search, limit, page }),
    enabled: !!token,
    placeholderData: (prevData) => prevData,
  });

  const { mutate: _create, isPending } = useActivity(token!);

  const handleCreate = async () => {
    if (!name || name.trim() === "") {
      return showAlert({
        variant: "error",
        title: "Opération échouée",
        message: "La désignation du secteur/activité est requise.",
      });
    }

    try {
      await _create({ name: name.trim(), description: desc! });
      closeModal();
      setName("");
      setDesc("");
    } catch (error) {
      showAlert({
        variant: "error",
        title: "Erreur",
        message: `${error}`,
      });
    }
  };

  const meta = Activity?.data?.meta;

  return (
    <div className="space-y-6">
      {/* Activitys */}
      <ComponentCard
        content={
          <div className="flex items-center justify-end">
            <Button onClick={openModal}>Ajouter un secteur</Button>
          </div>
        }
      >
        {loaderActivity ? (
          <div className="flex h-[64vh] items-center justify-center">
            <SpinLoader />
          </div>
        ) : errorActivity ? (
          <p className="text-red-500">
            Erreur lors du chargement des secteur/activités.
          </p>
        ) : (
          <>
            <BasicTableOne data={Activity!} />
            <div className="flex w-full justify-center">
              {meta && (
                <Pagination
                  currentPage={meta.currentPage}
                  totalPages={meta.lastPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </>
        )}
      </ComponentCard>

      {/* Modal ajout de secteur/activité */}
      <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-md">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Ajouter un secteur/activité
          </h2>

          <div className="space-y-3">
            <Label>Designation du secteur/activité</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-3">
            <Label>Description du secteur/activité</Label>
            <Input value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleCreate}>
              {isPending ? <SpinnerLoader /> : "Ajouter"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
