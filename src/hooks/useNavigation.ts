import { useAuth } from "@/context/AuthProvider";
import { useMemo } from "react";

export interface NavSubItem {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
}

export interface NavItem {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: NavSubItem[];
}

export const useNavigation = (): NavItem[] => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    return [
      ...(user?.data?.user?.role?.permissions || []),
      ...(user?.data?.user?.special_permissions || []),
    ];
  }, [user]);

  const navItems: NavItem[] = useMemo(() => {
    const items: NavItem[] = [];

    // ✅ Regrouper les autres permissions par module (hors Configuration)
    const moduleMap: Record<string, NavSubItem[]> = {};

    permissions.forEach((perm) => {
      if (perm.module === "Configuration") return;

      if (!moduleMap[perm.module]) {
        moduleMap[perm.module] = [];
      }

      moduleMap[perm.module].push({
        name: perm.module,
        path: perm.path,
      });
    });

    // Ajouter tous les autres modules
    for (const [module, subItems] of Object.entries(moduleMap)) {
      if (subItems.length === 1) {
        items.push({
          name: module,
          icon: null,
          path: subItems[0].path,
        });
      } else {
        items.push({
          name: module,
          icon: null,
          subItems,
        });
      }
    }

    // ✅ Ajouter la configuration en dernier si présente
    const hasConfigAccess = permissions.some(
      (p) => p.module === "Configuration",
    );

    if (hasConfigAccess) {
      const configSubItems: NavSubItem[] = [
        { name: "Role & Permission", path: "/config/role" },
        { name: "Article", path: "/product/article" },
        { name: "Catégorie & Sous-catégorie", path: "/product/category" },
      ];

      items.push({
        name: "Configuration",
        icon: null,
        subItems: configSubItems,
      });
    }

    // ✅ Mettre "Dashboard" en première position s’il existe
    const dashboardIndex = items.findIndex((item) => item.name === "Dashboard");
    if (dashboardIndex > 0) {
      const [dashboardItem] = items.splice(dashboardIndex, 1);
      items.unshift(dashboardItem);
    }

    return items;
  }, [permissions]);

  return navItems;
};
