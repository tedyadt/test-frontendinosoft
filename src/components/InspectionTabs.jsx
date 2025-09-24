import { useState } from "react";
import Datatable from "./Datatable";
import CreateRequestForm from "./CreateRequestForm";

export default function InspectionTabs({ data }) {
  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [inspections, setInspections] = useState(data);

  const filteredData = inspections.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "Open") return ["Pending"].includes(item.status);
    if (activeTab === "For Review") return item.status === "Approved";
    if (activeTab === "Completed") return item.status === "Rejected";
    return true;
  });

  const tabs = ["All", "Open", "For Review", "Completed"];

  const handleCreate = (newData) => {
    setInspections([...inspections, newData]);
    setShowForm(false); // tutup form setelah submit
  };

  return (
    <div className="w-full">
      {!showForm && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 -mb-px text-base font-medium border-b-4 transition-colors
                  ${
                    activeTab === tab
                      ? "border-cyan-600 text-cyan-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tombol Create */}
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-cyan-600 text-white hover:bg-cyan-700 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg
                className="shrink-0 size-4"
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
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Request
            </button>
          </div>
        </>
      )}

      {/* Form */}
      {showForm && <CreateRequestForm onCreate={handleCreate} onCancel={() => setShowForm(false)} />}

      {/* Tabel */}
      {!showForm && (
        <div className="mt-2">
          <Datatable data={filteredData} />
        </div>
      )}
    </div>
  );
}
