import React from "react";

const Datatable = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-300">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-600">RequestNumber</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Location</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Type</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">DateSubmitted</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">RelatedTo</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-gray-800">{item.requestNumber}</td>
                <td className="px-6 py-4 text-gray-800">{item.location}</td>
                <td className="px-6 py-4 text-gray-800">{item.type}</td>
                <td className="px-6 py-4 text-gray-800">{item.dateSubmitted}</td>
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
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="px-6 py-4 text-center text-gray-500 italic"
              >
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Datatable;
