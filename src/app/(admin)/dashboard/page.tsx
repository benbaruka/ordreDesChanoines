"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DatePicker, Select } from "antd";
import { BsCoin } from "react-icons/bs";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import { GiReceiveMoney } from "react-icons/gi";
import { MdAccountBalance } from "react-icons/md";

import Badge from "@/components/ui/badge/Badge";
import ProductTable from "@/components/trans/tables/BasicTableOne";
import StatisticsChart from "@/components/chart/Statistic";
import PieChart from "@/components/chart/Pie";

import {
  _getState,
  _getLine,
  _getPie,
  _getLastIn,
  _getYear,
} from "@/controller/query/dash/dash.service";

import { useAuth } from "@/context/AuthProvider";
import { _getActivity } from "@/controller/query/activity/activity.service";
import { _getAllUser } from "@/controller/query/users/users.service";
import SpinLoader from "@/global/spinLoader/SpinLoader";

const { RangePicker } = DatePicker;

const formatDateDMY = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const Dashboard = () => {
  const { user } = useAuth();
  const token = user?.data?.token?.token;

  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState<number>(currentYear);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [activityId, setActivityId] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const [filters, setFilters] = useState({
    start_at: formatDateDMY(new Date(currentYear, 0, 1)),
    end_at: formatDateDMY(new Date(currentYear, 11, 31)),
    activity_id: undefined,
    user_id: undefined,
  });

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

  const activityOptions = [
    { value: "", label: "Toutes les activités" },
    ...(activities?.data?.data?.map((a: any) => ({
      value: a?.id,
      label: a?.name,
    })) ?? []),
  ];

  const userOptions = [
    { value: "", label: "Tous les utilisateurs" },
    ...(users?.data?.data?.map((u: any) => ({
      value: u?.id,
      label: u?.full_name,
    })) ?? []),
  ];

  useEffect(() => {
    let newFilters: any = {
      activity_id: activityId || undefined,
      user_id: userId || undefined,
    };

    if (dateRange && dateRange[0] && dateRange[1]) {
      newFilters.start_at = dateRange[0].format("YYYY-MM-DD");
      newFilters.end_at = dateRange[1].format("YYYY-MM-DD");
    } else {
      newFilters.start_at = `${year}-01-01`;
      newFilters.end_at = `${year}-12-31`;
    }

    setFilters(newFilters);
  }, [year, dateRange, activityId, userId]);

  // Queries
  const {
    data: stateData,
    isLoading: stateLoading,
    error: stateError,
  } = useQuery({
    queryKey: ["dashboardState", filters],
    queryFn: () => _getState(token!, filters),
    enabled: !!token,
  });
  const {
    data: yearData,
    isLoading: yearLoading,
    error: yearError,
  } = useQuery({
    queryKey: ["years", filters],
    queryFn: () => _getYear(token!),
    enabled: !!token,
  });

  const { data: lineData, isLoading: lineLoading } = useQuery({
    queryKey: ["dashboardLine", filters],
    queryFn: () => _getLine(token!, filters),
    enabled: !!token,
  });

  const { data: pieData, isLoading: pieLoading } = useQuery({
    queryKey: ["dashboardPie", filters],
    queryFn: () => _getPie(token!, filters),
    enabled: !!token,
  });

  const { data: lastInData, isLoading: lastInLoading } = useQuery({
    queryKey: ["dashboardLastIn", filters],
    queryFn: () => _getLastIn(token!, filters),
    enabled: !!token,
  });

  const isAnyLoading =
    stateLoading || lineLoading || pieLoading || lastInLoading;

  if (stateError) {
    return (
      <p className="p-6 text-red-500">
        Erreur: {(stateError as Error).message}
      </p>
    );
  }

  const stats = {
    total_inputs: stateData?.data?.total_inputs || 0,
    total_outputs: stateData?.data?.total_outputs || 0,
    difference: stateData?.data?.difference || 0,
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6 p-6">
      {/* Filtres */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Tableau de Bord
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          <Select
            value={year}
            onChange={(value) => {
              setYear(Number(value));
              setDateRange(null);
            }}
            options={yearData?.data?.map((y) => ({ value: y, label: y }))}
            className="w-36"
          />

          <RangePicker
            value={dateRange as any}
            onChange={(dates) => setDateRange(dates)}
            format="YYYY-MM-DD"
            className="w-80"
            allowClear
          />

          <Select
            options={activityOptions}
            placeholder="Sélectionner une activité"
            onChange={(value) => setActivityId(value)}
            className="w-64"
            allowClear
          />

          <Select
            options={userOptions}
            placeholder="Sélectionner un utilisateur"
            onChange={(value) => setUserId(value)}
            className="w-64"
            allowClear
          />
        </div>
      </div>

      {/* Loader après filtre */}
      {isAnyLoading ? (
        <div className="flex h-[64vh] items-center justify-center">
          <SpinLoader />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                <GiReceiveMoney className="text-xl text-gray-800 dark:text-white/90" />
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Entrée
                  </span>
                  <h4 className="mt-2 text-lg font-bold text-gray-800 dark:text-white">
                    {stats.total_inputs} $
                  </h4>
                </div>
                <Badge color={stats.total_inputs > 0 ? "success" : "error"}>
                  {stats.total_inputs > 0 ? (
                    <HiArrowTrendingUp className="mr-1" />
                  ) : (
                    <HiArrowTrendingDown className="mr-1" />
                  )}
                  {stats.total_inputs}
                </Badge>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                <BsCoin className="text-xl text-gray-800 dark:text-white/90" />
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Sortie
                  </span>
                  <h4 className="mt-2 text-lg font-bold text-gray-800 dark:text-white">
                    {stats.total_outputs} $
                  </h4>
                </div>
                <Badge color={stats.total_outputs > 0 ? "error" : "success"}>
                  {stats.total_outputs > 0 ? (
                    <HiArrowTrendingDown className="mr-1" />
                  ) : (
                    <HiArrowTrendingUp className="mr-1" />
                  )}
                  {stats.total_outputs}
                </Badge>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                <MdAccountBalance className="text-xl text-gray-800 dark:text-white/90" />
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Balance
                  </span>
                  <h4 className="mt-2 text-lg font-bold text-gray-800 dark:text-white">
                    {stats.difference} $
                  </h4>
                </div>
                <Badge color={stats.difference >= 0 ? "success" : "error"}>
                  {stats.difference >= 0 ? (
                    <HiArrowTrendingUp className="mr-1" />
                  ) : (
                    <HiArrowTrendingDown className="mr-1" />
                  )}
                  {stats.difference}
                </Badge>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="col-span-2 rounded-2xl bg-white p-6 shadow dark:bg-gray-900">
              <h2 className="mb-4 text-lg font-semibold">Revenus</h2>
              <div className="h-64 w-full">
                <StatisticsChart data={lineData!} />
              </div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900">
              <h2 className="mb-4 text-lg font-semibold">Entrée et Sortie</h2>
              <div className="h-64 w-full">
                <PieChart data={pieData!} />
              </div>
            </div>
          </div>

          {/* Last In */}
          <div className="w-full">
            <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900">
              <h2 className="mb-4 text-lg font-semibold">Dernières opérations</h2>
              <ProductTable data={lastInData?.data!} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
