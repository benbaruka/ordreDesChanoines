"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export interface ResponseLine {
  input: number;
  output: number;
}

export interface DashboardLineData {
  status: boolean;
  data: Record<string, ResponseLine>; // La clé est une date au format YYYY-MM-DD
}

export default function StatisticsChart({ data }: { data: DashboardLineData }) {
  // Transformation des données
  const sortedDates = Object.keys(data.data).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  const inputSeries = sortedDates.map((date) => data.data[date].input);
  const outputSeries = sortedDates.map((date) => data.data[date].output);

  // Formater les dates en labels courts (ex: 'Jul 22')
  const categories = sortedDates.map((date) => {
    const d = new Date(date);
    return d.toLocaleDateString("default", { month: "short", day: "numeric" });
  });

  const series = [
    { name: "Entrées", data: inputSeries },
    { name: "Sorties", data: outputSeries },
  ];

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#FF4D4F"], // Bleu pour Input, rouge pour Output
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: { width: 2, curve: "smooth" },
    fill: { type: "gradient", gradient: { opacityFrom: 0.55, opacityTo: 0 } },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { fontSize: "12px", colors: ["#6B7280"] } },
      title: { text: "", style: { fontSize: "0px" } },
    },
    responsive: [
      {
        breakpoint: 1280,
        options: {
          chart: { width: "100%" },
        },
      },
    ],
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height="100%" // prend toute la hauteur du parent
      width="100%"
    />
  );
}
