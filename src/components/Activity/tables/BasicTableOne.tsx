import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";

import DateFormatter from "@/utils/dateFns";
import { FiEye, FiMoreVertical } from "react-icons/fi";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthProvider";
import { useUpadateActivity } from "@/controller/query/activity/useActivity";
import { useAlert } from "@/context/AlertProvider";
import SpinnerLoader from "@/global/spinner/SpinnerLoader";
import Checkbox from "@/components/form/input/Checkbox";
import { ResponseActivities } from "@/types";

export default function BasicTableOne({ data }: { data: ResponseActivities }) {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const token = user?.data?.token?.token;
  const { isOpen, openModal, closeModal } = useModal();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPermission, setShowPermission] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    ResponseActivities["data"]["data"][0] | null
  >(null);
  const [name, setName] = useState<string>();
  const [desc, setDesc] = useState<string>();
  // const { mutate: _delete, isPending: isLoadingDelete } = useDeleterole(token!);
  const { mutate: _update, isPending: isLoadingUpadate } = useUpadateActivity(
    token!,
  );

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };
  const handlePermissionClick = () => {
    setShowPermission(true);
  };
  const handleUpdate = async () => {
    if (!selectedRole?.id) {
      return showAlert({
        variant: "error",
        title: "Opération échouée",
        message: "Aucun rôle sélectionné",
      });
    }

    try {
      await _update({
        credentials: { name: name!, description: desc! },
        id: selectedRole.id,
      });
      closeModal();
    } catch (error) {
      showAlert({
        variant: "error",
        title: "Erreur",
        message: `${error}`,
      });
    }
  };

  const handleCancelPermission = () => {
    setShowPermission(false);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Désignation
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Description
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Date de création
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Statut
                </TableCell>
                {/* <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Permissions
                </TableCell> */}
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data?.data?.data?.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                      {role.name}
                    </p>
                  </TableCell>
                  <TableCell className="px-5 py-2 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {role.description || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-2 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {DateFormatter?.formatDateLong(role?.created_at)}
                  </TableCell>
                  <TableCell className="px-5 py-2 text-start">
                    <Badge size="sm" color={role?.status ? "success" : "error"}>
                      {role.status ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  {/* <TableCell className="px-5 py-2 text-start text-theme-xs text-gray-700 dark:text-gray-300">
                    <Badge size="sm" color="warning">
                      <button
                        className="h-full w-full"
                        onClick={() => {
                          setSelectedRole(role);
                          handlePermissionClick();
                        }}
                      >
                        ajouter permission
                      </button>
                    </Badge>
                  </TableCell> */}
                  <TableCell className="px-5 py-4 text-end text-theme-sm text-gray-500 dark:text-gray-400">
                    <FiMoreVertical
                      onClick={() => {
                        setSelectedRole(role);
                        openModal();
                      }}
                      className="cursor-pointer"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal de détails */}
      <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-[700px]">
        {selectedRole && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Détail du rôle
            </h2>
            <div className="space-y-3">
              <div>
                <Label>Désignation</Label>
                <Input
                  onChange={(e) => setName(e.target.value)}
                  defaultValue={selectedRole.name}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  onChange={(e) => setDesc(e.target.value)}
                  defaultValue={selectedRole.description}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Statut</Label>
                  <Input
                    disabled
                    defaultValue={selectedRole.status ? "Actif" : "Inactif"}
                  />
                </div>
                <div>
                  <Label>Date de création</Label>
                  <Input
                    disabled
                    defaultValue={DateFormatter?.formatDateLong(
                      selectedRole.created_at,
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={handleUpdate}>
                {isLoadingUpadate ? <SpinnerLoader /> : "Sauvegarder"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de confirmation */}
    </div>
  );
}
