import { useState, useEffect } from "react";
import Datatable from "./Datatable";
import CreateRequestForm from "./CreateRequestForm";
import DetailsInspection from "./DetailsInspection";

export default function InspectionTabs({ data }) {
  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [inspections, setInspections] = useState([]);

  // Load dari localStorage atau props
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("requests") || "[]");
    if (saved.length > 0) {
      setInspections(saved);
    } else {
      setInspections(data || []);
    }
  }, [data]);

  // Simpan ke localStorage
  useEffect(() => {
    if (inspections.length > 0) {
      localStorage.setItem("requests", JSON.stringify(inspections));
    }
  }, [inspections]);

  // Filter data sesuai tab
  const filteredData = inspections.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "Open") return ["Pending", "Baru"].includes(item.status);
    if (activeTab === "For Review") return item.status === "Approved";
    if (activeTab === "Completed") return item.status === "Rejected";
    return true;
  });

  const tabs = ["All", "Open", "For Review", "Completed"];

  const handleSubmit = (newData) => {
    setInspections([...inspections, newData]);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
    setShowForm(false);
  };

  return (
    <div className="w-full">
      {/* === Kondisi 1: Create Form === */}
      {showForm && (
        <CreateRequestForm
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          onBack={() => setShowForm(false)}
        />
      )}

      {/* === Kondisi 2: Detail Inspection === */}
      {!showForm && showDetail && (
        <DetailsInspection
          data={showDetail}
          items={data.items}
          onBack={() => setShowDetail(null)}
        />
      )}

      {/* === Kondisi 3: Default (Tabs + Button + Table) === */}
      {!showForm && !showDetail && (
        <>
          {/* Alert */}
          {showAlert && (
            <div className="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 fixed top-4 right-4 z-50">
              <div className="flex">
                <div className="shrink-0">
                  <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800">
                    ✔
                  </span>
                </div>
                <div className="ms-3">
                  <h3 className="text-gray-800 font-semibold">
                    Successfully submitted.
                  </h3>
                  <p className="text-sm text-gray-700">
                    Your form has been saved successfully.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile → Dropdown */}
          <div className="md:hidden mb-3">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full border-cyan-600 rounded-lg p-2 text-medium text-cyan-600 border-b-4 focus:border-cyan-800 "
            >
              {tabs.map((tab) => (
                <option key={tab} value={tab}>
                  {tab}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop → Horizontal Tabs */}
          <div className="hidden md:block overflow-x-auto">
            <div className="flex border-b border-gray-200 min-w-max">
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
          </div>

          {/* Tombol Create */}
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-cyan-600 text-white hover:bg-cyan-700"
            >
              + Create Request
            </button>
          </div>

          {/* Tabel */}
          <div className="mt-3">
            <Datatable
              data={filteredData}
              onDetailClick={(item) => setShowDetail(item)}
            />
          </div>
        </>
      )}
    </div>
  );
}
