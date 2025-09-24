import React from "react";
import InspectionTabs from "@/components/InspectionTabs";


export default function Home() {
  const inspections = [
    {
      requestNumber: "REQ-001",
      location: "Jakarta",
      type: "Electrical",
      dateSubmitted: "2025-09-20",
      relatedTo: "Building A",
      status: "Pending",
    },
    {
      requestNumber: "REQ-002",
      location: "Bandung",
      type: "Mechanical",
      dateSubmitted: "2025-09-21",
      relatedTo: "Factory 1",
      status: "Approved",
    },
    {
      requestNumber: "REQ-003",
      location: "Surabaya",
      type: "Safety",
      dateSubmitted: "2025-09-22",
      relatedTo: "Warehouse",
      status: "Rejected",
    },
    {
      requestNumber: "REQ-004",
      location: "Medan",
      type: "Fire",
      dateSubmitted: "2025-09-23",
      relatedTo: "Office HQ",
      status: "Pending",
    },
  ];

  return (
   <div className="w-full p-4">
      {/* Breadcrumb  */}
      <p className="text-2xl text-black font-semibold mb-2 text-left">Inspection Record</p>
      <ol className="flex items-center whitespace-nowrap mb-6">
        <li className="inline-flex items-center">
          <a
            href="#"
            className="flex items-center text-sm font-semibold text-cyan-600 hover:text-cyan-600 focus:outline-hidden focus:text-cyan-600"
          >
            Home
          </a>
          <svg
            className="shrink-0 mx-2 size-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </li>
        <li className="inline-flex items-center">
          <a
            href="#"
            className="flex items-center text-sm text-gray-800 font-semibold hover:text-cyan-600 focus:outline-hidden focus:text-cyan-600"
          >
            Inspection
            <svg
              className="shrink-0 mx-2 size-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </a>
        </li>
        <li
          className="inline-flex items-center text-sm font-semibold text-gray-800 truncate"
          aria-current="page"
        >
          Inspection Record
        </li>
      </ol>

      {/* Box untuk judul + tabs */}
      <div className="w-full p-4 bg-white rounded-md shadow">
        <InspectionTabs data={inspections} />
      </div>
    </div>
  );
}