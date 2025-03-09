// "use client";

// import {
//   AdminPendudukFields,
//   adminPendudukStore,
// } from "@/lib/firebase/admin_penduduk";
// import { useEffect, useState } from "react";
// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
// import {
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "../ui/chart";

// interface OverviewPendudukDataProps {
//   title: string;
//   value: number;
//   key: AdminPendudukFields;
// }

// const overviewPendudukData: OverviewPendudukDataProps[] = [
//   { title: "Penduduk", value: 0, key: "penduduk" },
//   { title: "Kepala Keluarga", value: 0, key: "kepala_keluarga" },
//   { title: "Laki-Laki", value: 0, key: "lk" },
//   { title: "Perempuan", value: 0, key: "pr" },
//   { title: "Penduduk Sementara", value: 0, key: "penduduk_sementara" },
//   { title: "Mutasi Penduduk", value: 0, key: "mutasi_penduduk" },
// ];

// export default function OverviewWithChart() {
//   const [chartData, setChartData] = useState(
//     [
//       { month: "January" },
//       { month: "February" },
//       { month: "March" },
//       { month: "April" },
//       { month: "May" },
//       { month: "June" },
//       { month: "July" },
//       { month: "August" },
//       { month: "September" },
//       { month: "October" },
//       { month: "November" },
//       { month: "December" },
//     ].map((item) => ({
//       ...item,
//       penduduk: 0,
//       kepala_keluarga: 0,
//       lk: 0,
//       pr: 0,
//       penduduk_sementara: 0,
//       mutasi_penduduk: 0,
//     })),
//   );

//   const chartConfig = {
//     penduduk: {
//       label: "Penduduk",
//       color: "#34d399",
//     },
//     kepala_keluarga: {
//       label: "Kepala Keluarga",
//       color: "#f59e0b",
//     },
//     lk: {
//       label: "Laki-Laki",
//       color: "#60a5fa",
//     },
//     pr: {
//       label: "Perempuan",
//       color: "#f472b6",
//     },
//     penduduk_sementara: {
//       label: "Penduduk Sementara",
//       color: "#a78bfa",
//     },
//     mutasi_penduduk: {
//       label: "Mutasi Penduduk",
//       color: "#fb7185",
//     },
//   };

//   useEffect(() => {
//     const unsubscribe = adminPendudukStore.subscribe((data) => {
//       const now = new Date();

//       const r = overviewPendudukData.reduce(
//         (acc, item) => {
//           // @ts-expect-error
//           acc[item.key] = data[item.key];
//           return acc;
//         },
//         {} as Record<AdminPendudukFields, number>,
//       );

//       setChartData([
//         ...chartData,
//         {
//           month: `${now.getMonth() + 1}`,
//           penduduk: r.penduduk,
//           kepala_keluarga: r.kepala_keluarga,
//           lk: r.lk,
//           pr: r.pr,
//           penduduk_sementara: r.penduduk_sementara,
//           mutasi_penduduk: r.mutasi_penduduk,
//         },
//       ]);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   return (
//     <ChartContainer
//       config={chartConfig}
//       className="h-[300px] w-full"
//     >
//       <BarChart
//         data={chartData}
//         margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//       >
//         <CartesianGrid
//           vertical={false}
//           strokeDasharray="3 3"
//         />
//         <XAxis
//           dataKey="month"
//           tickLine={false}
//           tickMargin={10}
//           axisLine={false}
//         />
//         <ChartTooltip content={<ChartTooltipContent />} />
//         <ChartLegend content={<ChartLegendContent />} />
//         {Object.keys(
//           overviewPendudukData.reduce(
//             (acc, item) => ({ ...acc, [item.key]: 0 }),
//             {},
//           ),
//         ).map((key) => (
//           <Bar
//             key={key}
//             dataKey={key}
//             fill="#2563eb"
//             radius={[4, 4, 0, 0]}
//           />
//         ))}
//       </BarChart>
//     </ChartContainer>
//   );
// }
