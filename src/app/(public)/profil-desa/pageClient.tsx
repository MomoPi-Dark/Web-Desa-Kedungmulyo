"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  AdminPendudukFields,
  adminPendudukStore,
} from "@/lib/firebase/admin_penduduk";
import Image from "next/image";
import { useEffect, useState } from "react";

const visi = [
  "Terwujudnya Kedungmulyo sebagai desa yang mandiri berbasis pertanian, untuk mencapai masyarakat yang sehat, cerdas dan lebih sejahtera.",
];

const misi = [
  "Meningkatkan pembangunan infrastruktur yang mendukung perekonomian desa seperti jalan, jembatan serta infrastruktur strategis lainnya.",
  "Meningkatkan pembangunan di bidang kesehatan untuk mendorong derajat kesehatan masyarakat agar dapat bekerja lebih optimal dan memiliki harapan hidup yang lebih panjang.",
  "Meningkatkan pembangunan di bidang pendidikan untuk mendorong peningkatan kualitas sumber daya manusia agar memiliki kecerdasan dan daya saing yang lebih baik.",
  "Meningkatkan pembangunan ekonomi dengan mendorong semakin tumbuh dan berkembangnya pembangunan di bidang pertanian dalam arti luas, industri, perdagangan dan pariwisata.",
  "Menciptakan tata kelola pemerintahan yang baik (good governance) berdasarkan demokratisasi, transparansi, penegakan hukum, berkeadilan, kesetaraan gender dan mengutamakan pelayanan kepada masyarakat.",
  "Mengupayakan pelestarian sumber daya alam untuk memenuhi kebutuhan dan pemerataan pembangunan guna meningkatkan perekonomian.",
];

const bagan_desa = [
  {
    url: "/img/badan_organisasi.jpg",
    alt: "Badan Organisasi",
    title: "Stuktur Organisasi Pemerintahan Desa Kedungmulyo",
  },
  {
    url: "/img/struktur_organisasi.jpeg",
    alt: "Struktur Organisasi",
    title: "Struktur Organisasi Badan Permusyawaratan Desa Kedungmulyo",
  },
];

const AccordionVisiMisi = ({ datas, title }: { title: string; datas: any }) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="h-full w-full rounded-lg border border-gray-200 bg-gray-200/50 p-1"
    >
      <AccordionItem
        value="item-1"
        className="border-b-0"
      >
        <AccordionTrigger className="flex items-center justify-between px-5 hover:no-underline">
          <span className="text-lg font-bold">{title}</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-5 py-2">
            <div className="text-lg text-gray-600">{datas}</div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const dataPenduduk: { key: AdminPendudukFields; value: number } = {
  key: "penduduk",
  value: 0,
};

const dataLuasDesa = [
  {
    arah: "Utara",
    desa: "Desa Kedungmulyo",
  },
  {
    arah: "Timur",
    desa: "Desa Kedungmulyo",
  },
  {
    arah: "Selatan",
    desa: "Desa Kedungmulyo",
  },
  {
    arah: "Barat",
    desa: "Desa Kedungmulyo",
  },
];

export default function ProfilDesa() {
  const [data, setData] = useState<{ key: AdminPendudukFields; value: number }>(
    dataPenduduk,
  );

  useEffect(() => {
    const unsubscribe = adminPendudukStore.subscribe((value) => {
      const { penduduk } = value;
      setData({ value: penduduk?.value || 0, key: data.key });
    });

    return () => unsubscribe();
  }, [data.key]);

  return (
    <div className="relative pb-20 pt-25">
      <div className="wrapper">
        <div className="mx-auto py-4">
          <div className="items-center space-y-22 lg:grid lg:grid-cols-12">
            <div className="col-span-6">
              {/* Logo Desa */}
              <div className="mb-6 flex justify-center">
                <Image
                  src="/logo/logo_boyolali.svg" // Ganti dengan URL atau path logo desa Anda
                  alt="Logo Desa"
                  width={150}
                  height={150}
                  className="rounded-lg"
                />
              </div>

              {/* Informasi Desa */}
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-bold text-gray-700">
                  Desa Kedungmulyo
                </h2>
                <p className="text-gray-600">
                  Kecamatan Kemusu, Kabupaten Boyolali, Provinsi Jawa Tengah
                </p>
              </div>
            </div>

            {/* Visi & Misi */}
            <div className="col-span-6 hidden space-y-3 pl-5 lg:block">
              {/* Visi */}
              <div>
                <h2 className="mb-4 text-center text-3xl font-bold text-gray-800">
                  Visi
                </h2>
                <p className="text-xl font-semibold text-gray-600">
                  {'"'}Terwujudnya Kedungmulyo sebagai desa yang mandiri
                  berbasis pertanian, untuk mencapai masyarakat yang sehat,
                  cerdas dan lebih sejahtera{'."'}
                </p>
              </div>
              {/* Misi */}
              <div>
                <h2 className="mb-4 text-center text-3xl font-bold text-gray-800">
                  Misi
                </h2>
                <ol className="list-inside list-decimal space-y-2 text-xl text-gray-600">
                  <li>
                    Meningkatkan pembangunan infrastruktur yang mendukung
                    perekonomian desa, seperti jalan, jembatan serta
                    infrastruktur strategis lainnya.
                  </li>
                  <li>
                    Meningkatkan pembangunan di bidang kesehatan untuk mendorong
                    derajat kesehatan masyarakat agar dapat bekerja lebih
                    optimal dan memiliki harapan hidup yang lebih panjang.
                  </li>
                  <li>
                    Meningkatkan pembangunan di bidang pendidikan untuk
                    mendorong peningkatan kualitas sumber daya manusia agar
                    memiliki kecerdasan dan daya saing yang lebih baik.
                  </li>
                  <li>
                    Meningkatkan pembangunan ekonomi dengan mendorong semakin
                    tumbuh dan berkembangnya pembangunan di bidang pertanian
                    dalam arti luas, industri, perdagangan dan pariwisata.
                  </li>
                  <li>
                    Menciptakan tata kelola pemerintahan yang baik (good
                    governance) berdasarkan demokratisasi, transparansi,
                    penegakan hukum, berkeadilan, kesetaraan gender dan
                    mengutamakan pelayanan kepada masyarakat.
                  </li>
                  <li>
                    Mengupayakan pelestarian sumber daya alam untuk memenuhi
                    kebutuhan dan pemerataan pembangunan guna meningkatkan
                    perekonomian.
                  </li>
                </ol>
              </div>
            </div>

            <div className="col-span-full hidden justify-center pl-5 lg:block">
              <div className="pl-2">
                <h2 className="text-start text-2xl font-extrabold text-gray-800">
                  Bagan Desa
                </h2>
                <h5 className="text-lg">Bagan Stuktur Desa Kedung Mulyo</h5>
              </div>
              <div className="mt-9 grid grid-cols-1 gap-4 space-y-13">
                {bagan_desa.map((item, index) => (
                  <div
                    key={index}
                    className="space-y-2"
                  >
                    <h5 className="text-heading-6 font-extrabold uppercase">
                      {item.title}
                    </h5>
                    <Image
                      src={item.url}
                      alt={item.alt || "Image"}
                      width={1000}
                      height={1000}
                      className="h-full w-full rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 lg:hidden">
              <AccordionVisiMisi
                title="Visi"
                datas={<div className="text-lg text-gray-600">{visi}</div>}
              />
              <AccordionVisiMisi
                title="Misi"
                datas={
                  <ol className="list-inside list-decimal space-y-2 text-gray-600">
                    {misi.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ol>
                }
              />
              <AccordionVisiMisi
                title="Bagan Desa"
                datas={
                  <div className="mt-9 grid grid-cols-1 gap-4">
                    {bagan_desa.map((item, index) => (
                      <Image
                        key={index}
                        src={item.url}
                        alt={item.alt}
                        width={1000}
                        height={1000}
                        className="h-full w-full rounded-lg"
                      />
                    ))}
                  </div>
                }
              />
            </div>

            <div className="col-span-full pt-10">
              <div className="pl-2">
                <h1 className="text-start text-2xl font-extrabold text-gray-800">
                  Peta Lokasi Desa
                </h1>
                <h5 className="text-lg">Peta Lokasi Desa Kedungmulyo</h5>
              </div>
              <div className="grid grid-rows-1 gap-4 pt-6 xl:grid-cols-2 xl:grid-rows-1">
                <div className="rounded-md border-4 border-gray-200">
                  <h1 className="p-5 text-start text-3xl font-bold text-gray-800">
                    Desa Kedungmulyo
                  </h1>
                  <Separator className="border-2 px-4" />
                  <div className="p-5">
                    <h2 className="pb-5 text-xl font-semibold text-gray-600">
                      Batas Desa
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {dataLuasDesa.map((item, index) => (
                        <div
                          key={index}
                          className="py-5"
                        >
                          <h3 className="text-xl font-bold text-gray-600">
                            Sebelah {item.arah}
                          </h3>
                          <p className="text-xl text-gray-600">{item.desa}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator className="border-2 px-4" />
                  <div className="grid grid-cols-2 items-center gap-4 p-5">
                    <span className="text-xl">Luas Desa</span>
                    <span className="text-xl">421.000 ㎡</span>
                  </div>
                  <Separator className="border-2 px-4" />
                  <div className="grid grid-cols-2 items-center gap-4 p-5">
                    <span className="text-xl">Jumlah Penduduk</span>
                    <span className="text-xl">{data.value} Jiwa</span>
                  </div>
                </div>
                <div className="hidden rounded-md border border-gray-200 xl:block">
                  <iframe
                    className="rounded-md border-4 border-gray-200" // Border tebal (4px) dan warna abu-abu gelap
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13311.944349487942!2d110.75337653365388!3d-7.278935577187057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70a08cf0b86591%3A0xf893bbf891e8fa4b!2sKedungmulyo%2C%20Kec.%20Kemusu%2C%20Kabupaten%20Boyolali%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1736904616477!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
