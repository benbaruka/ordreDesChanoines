"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataResponseBilan } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BilanTable({
  data,
}: {
  data:
    | DataResponseBilan
    | { status: boolean; data: DataResponseBilan }
    | null
    | undefined;
}) {
  const payload: DataResponseBilan = React.useMemo(() => {
    const d = (data as any)?.data ?? data ?? {};
    return {
      year: d.year ?? new Date().getFullYear().toString(),
      results: Array.isArray(d.results) ? d.results : [],
      totals: d.totals ?? null,
    };
  }, [data]);

  const totals = React.useMemo(() => {
    if (payload.totals?.input != null) return payload.totals;
    return payload.results.reduce(
      (acc, r) => {
        const input = Number(r.input ?? 0);
        const output = Number(r.output ?? 0);
        const balance = r.balance != null ? Number(r.balance) : input - output;
        acc.input += input;
        acc.output += output;
        acc.balance += balance;
        return acc;
      },
      { input: 0, output: 0, balance: 0 },
    );
  }, [payload]);

  const fmt = (n?: number) =>
    (n ?? 0)
      .toLocaleString("fr-FR", { useGrouping: true })
      .replace(/\u202F/g, "");

  const fmtBalance = (n: number) =>
    n > 0 ? `+${fmt(n)}` : n < 0 ? `-${fmt(Math.abs(n))}` : fmt(0);

  const generatePDF = () => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf
      .setFontSize(28)
      .setTextColor(0, 0, 0)
      .text("Bilan Commercial", pageWidth / 2, 40, { align: "center" });
    pdf
      .setFontSize(20)
      .text(`Année : ${payload.year}`, pageWidth / 2, 75, { align: "center" });
    pdf
      .setFontSize(16)
      .text(
        "Résumé mensuel des entrées, sorties et balances",
        pageWidth / 2,
        100,
        { align: "center" },
      );

    const colWidths = [150, 150, 150, 150]; // Largeur fixe pour aligner les totaux

    // Tableau principal
    autoTable(pdf, {
      startY: 130,
      head: [["Mois", "Entrées", "Sorties", "Balance"]],
      body: payload.results.map((r) => {
        const input = Number(r.input ?? 0);
        const output = Number(r.output ?? 0);
        const balance = r.balance != null ? Number(r.balance) : input - output;
        return [
          r.month ?? "-",
          fmt(input) + " $",
          fmt(output) + " $",
          fmtBalance(balance) + " $",
        ];
      }),
      theme: "grid",
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 0,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 14 },
      columnStyles: {
        0: { cellWidth: colWidths[0] },
        1: {
          cellWidth: colWidths[1],
          textColor: [0, 128, 0],
          fontStyle: "bold",
        },
        2: {
          cellWidth: colWidths[2],
          textColor: [255, 0, 0],
          fontStyle: "bold",
        },
        3: {
          cellWidth: colWidths[3],
          textColor: totals.balance >= 0 ? [0, 0, 255] : [255, 0, 0],
          fontStyle: "bold",
        },
      },
    });

    // Totaux sous chaque colonne
    autoTable(pdf, {
      startY: (pdf.lastAutoTable?.finalY ?? 130) + 5,
      body: [
        [
          "Totaux",
          fmt(totals.input) + " $",
          fmt(totals.output) + " $",
          fmtBalance(totals.balance) + " $",
        ],
      ],
      theme: "grid",
      bodyStyles: { fontSize: 16, fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: colWidths[0], textColor: 0 },
        1: { cellWidth: colWidths[1], textColor: [0, 128, 0] },
        2: { cellWidth: colWidths[2], textColor: [255, 0, 0] },
        3: {
          cellWidth: colWidths[3],
          textColor: totals.balance >= 0 ? [0, 0, 255] : [255, 0, 0],
        },
      },
    });

    pdf.save(`Bilan-${payload.year}.pdf`);
  };

  if (!payload.results.length)
    return (
      <div className="rounded-xl border bg-white p-6 text-center dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Bilan Commercial - {payload.year}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Aucune donnée disponible pour cette année.
        </p>
      </div>
    );

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between border-b px-6 py-4 dark:border-white/[0.05]">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Bilan Commercial - {payload.year}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Résumé mensuel des entrées, sorties et balances
          </p>
        </div>
        <button
          onClick={generatePDF}
          className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Exporter PDF
        </button>
      </div>
      <div className="max-w-full overflow-x-auto p-6">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-white/[0.05]">
              <TableRow>
                {["Mois", "Entrées", "Sorties", "Balance"].map((h, i) => (
                  <TableCell
                    key={i}
                    className={`px-6 py-3 text-lg font-bold ${i === 1 ? "text-green-600" : i === 2 ? "text-red-600" : "text-blue-600"} dark:${i === 1 ? "text-green-400" : i === 2 ? "text-red-400" : "text-blue-400"}`}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {payload.results.map((r, i) => {
                const input = Number(r.input ?? 0);
                const output = Number(r.output ?? 0);
                const balance =
                  r.balance != null ? Number(r.balance) : input - output;
                return (
                  <TableRow
                    key={r.month ?? i}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                  >
                    <TableCell className="px-6 py-3 text-lg font-semibold text-gray-800 dark:text-white">
                      {r.month ?? "-"}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-xl font-bold text-green-600 dark:text-green-400">
                      {fmt(input)} $
                    </TableCell>
                    <TableCell className="px-6 py-3 text-xl font-bold text-red-600 dark:text-red-400">
                      {fmt(output)} $
                    </TableCell>
                    <TableCell
                      className={`px-6 py-3 text-xl font-bold ${balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {fmtBalance(balance)} $
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* Totaux en dessous de chaque colonne */}
              <TableRow className="bg-blue-50 dark:bg-blue-900/20">
                <TableCell className="px-6 py-3 text-2xl font-bold text-gray-800 dark:text-white">
                  Totaux
                </TableCell>
                <TableCell className="px-6 py-3 text-2xl font-bold text-green-600 dark:text-green-400">
                  {fmt(totals.input)} $
                </TableCell>
                <TableCell className="px-6 py-3 text-2xl font-bold text-red-600 dark:text-red-400">
                  {fmt(totals.output)} $
                </TableCell>
                <TableCell
                  className={`px-6 py-3 text-2xl font-bold ${totals.balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {fmtBalance(totals.balance)} $
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
