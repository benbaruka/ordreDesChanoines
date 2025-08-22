"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export interface ResponsePie {
  status: boolean;
  data: DataResponsePie;
}

export interface DataResponsePie {
  input: number;
  output: number;
}

interface PieChartProps {
  data: ResponsePie;
}

export default function PieChart({ data }: PieChartProps) {
  if (!data.status) return <p className="text-red-500">No data available</p>;

  const series = [data.data.input, data.data.output];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    labels: ["Entrées", "Sorties"],
    colors: ["#465FFF", "#FF4D4F"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(0);
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { width: "100%" },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        width="100%"
        height={300}
      />
    </div>
  );
}
