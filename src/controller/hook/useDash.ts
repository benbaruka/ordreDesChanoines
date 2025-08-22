import { useQuery } from "@tanstack/react-query";
import {
  _getState,
  _getLine,
  _getPie,
  _getLastIn,
} from "@/controller/query/dash/dash.service"; // adapte le chemin
import { useState } from "react";

export const useDashboardData = (token: string | null, filters?: any) => {
  // Valeur par défaut pour filters
  const safeFilters = filters || {};
  const [yearFilter, setYearFilter] = useState(
    safeFilters.year || new Date().getFullYear(),
  );

  const stateQuery = useQuery({
    queryKey: ["dashboardState", yearFilter],
    queryFn: () => _getState(token!, safeFilters),
    enabled: !!token,
  });

  const lineQuery = useQuery({
    queryKey: ["dashboardLine", yearFilter],
    queryFn: () => _getLine(token!, safeFilters),
    enabled: !!token,
  });

  const pieQuery = useQuery({
    queryKey: ["dashboardPie", yearFilter],
    queryFn: () => _getPie(token!, safeFilters),
    enabled: !!token,
  });

  const lastInQuery = useQuery({
    queryKey: ["dashboardLastIn", yearFilter],
    queryFn: () => _getLastIn(token!, safeFilters),
    enabled: !!token,
  });

  return {
    stateQuery,
    lineQuery,
    pieQuery,
    lastInQuery,
    setYearFilter,
  };
};
