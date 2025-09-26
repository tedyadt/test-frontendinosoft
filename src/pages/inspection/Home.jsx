// Home.jsx
"use client";
import React, { useState } from "react";
import InspectionTabs from "@/components/InspectionTabs";
import { Link } from "react-router-dom";

export default function Home() {
  const [inspections, setInspections] = useState([]);

  return (
    <div className="w-full p-6 bg-gray-100 mt-2">
      {/* Breadcrumb */}
      <p className="text-2xl text-black font-semibold mb-2 text-left">
        Inspection Record
      </p>
      <ol className="flex items-center whitespace-nowrap mb-6">
        <li className="inline-flex items-center">
          <Link
            to="#"
            className="flex items-center text-sm font-semibold text-gray-800 hover:text-cyan-600"
          >
            Home
          </Link>
          <svg
            className="shrink-0 mx-2 size-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </li>
        <li className="inline-flex items-center">
          <Link
            to=""
            className="flex items-center text-sm font-semibold text-gray-800 hover:text-cyan-600"
          >
            Inspection
          </Link>
          <svg
            className="shrink-0 mx-2 size-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </li>
        <li
          className="inline-flex items-center text-sm font-semibold text-gray-800 truncate"
          aria-current="page"
        >
          Inspection Record
        </li>
      </ol>

      {/* Body */}
      <div className="w-full p-4 bg-white rounded-md shadow">
        <InspectionTabs data={inspections} />
      </div>
    </div>
  );
}
