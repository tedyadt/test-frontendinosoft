import React, { useState } from "react";
import DetailsInspection from "./DetailsInspection";

const Datatable = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDetailClick = (item) => {
    setSelectedItem(item);
  };

  const handleBack = () => {
    setSelectedItem(null);
  };

  if (selectedItem) {
    return <DetailsInspection data={selectedItem} onBack={handleBack} />;
  }

  // Urutkan data berdasarkan dateSubmitted dari terbaru ke terlama
  const sortedData = [...data].sort(
    (a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted)
  );

  // Fungsi format tanggal
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Filter data berdasarkan search
  const filteredData = sortedData.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.requestNumber.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.relatedTo.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="overflow-x-auto rounded-2xl shadow-sm">
      {/* Search Bar */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Cari data..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2 mr-2 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-cyan-600 w-64"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200 text-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Request Number
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Location
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Type
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Date Submitted
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Related To
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.requestNumber} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800">
                    {item.requestNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-800">{item.location}</td>
                  <td className="px-6 py-4 text-gray-800">{item.type}</td>
                  <td className="px-6 py-4 text-gray-800">
                    {formatDate(item.dateSubmitted)}
                  </td>
                  <td className="px-6 py-4 text-gray-800">{item.relatedTo}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                        ${
                          item.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDetailClick(item)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                      title="Detail"
                    >
                      <svg
                        className="w-6 h-6 text-cyan-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"></path>
                        <path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 text-center text-gray-500 italic"
                >
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div
              key={item.requestNumber}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <p className="text-sm">
                <span className="font-medium text-gray-600">Request Number:</span>{" "}
                {item.requestNumber}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-600">Location:</span>{" "}
                {item.location}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-600">Type:</span>{" "}
                {item.type}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-600">Date Submitted:</span>{" "}
                {formatDate(item.dateSubmitted)}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-600">Related To:</span>{" "}
                {item.relatedTo}
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium text-gray-600">Status:</span>{" "}
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                    ${
                      item.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                >
                  {item.status}
                </span>
              </p>
              <button
                onClick={() => handleDetailClick(item)}
                className="flex justify-center w-full p-2 rounded-lg hover:bg-gray-100"
                title="Detail"
              >
                <svg
                  className="w-6 h-6 text-cyan-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"></path>
                  <path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"></path>
                </svg>
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">Tidak ada data</p>
        )}
      </div>
    </div>
  );
};

export default Datatable;
