"use client";

import { useState } from "react";

import information from "../../../information.mjs";
const {
  struktur_desa: { kepala },
} = information;

function Greetings() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="text-center xl:text-start"
      style={{
        fontFamily: "'outfit'",
      }}
    >
      <h1 className="pb-10 text-4xl font-semibold">Sambutan Kepala Desa</h1>
      <h3 className="py-2 text-3xl font-semibold">{kepala}</h3>
      <p className="mb-6 text-xl italic text-gray-600">
        Kepala Desa Kedungmulyo
      </p>
      <div
        className={`text-xl leading-relaxed ${isExpanded ? "" : "line-clamp-6"}`}
      >
        <p className="text-xl text-gray-600">
          Assalamualaikum Warahmatullahi Wabarakatuh,
        </p>
        <p className="mt-4 text-gray-700">
          Website ini hadir sebagai wujud transformasi Desa Kedungmulyo Boyolali
          untuk menjadi desa yang mampu memanfaatkan teknologi informasi dan
          komunikasi secara maksimal. Dengan integrasi ke dalam sistem online,
          website ini mendukung keterbukaan informasi publik, pelayanan publik,
          dan kegiatan perekonomian di desa. Harapannya, Desa Kedungmulyo
          Boyolali dapat menjadi desa yang mandiri, berdaya saing, dan terus
          berkembang menuju kemajuan teknologi.
        </p>
      </div>
      <button
        className="mt-3 text-blue-500 underline hover:text-blue-700"
        onClick={toggleExpanded}
      >
        {isExpanded ? "Sembunyikan" : "Selengkapnya"}
      </button>
      <p className="mt-6 text-xl font-semibold text-gray-800">
        Kepala Desa Kedungmulyo
      </p>
      <p className="text-xl font-bold text-gray-800">{kepala}</p>
    </div>
  );
}

export default Greetings;
