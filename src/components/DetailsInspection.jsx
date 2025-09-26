import React from "react";

const DetailsInspection = ({ data, items, onBack }) => {
  if (!data) return null;

  return (
    <div>
      {/* Tombol Back */}
      <div className="mb-4">
        <button onClick={onBack} className="flex items-center gap-2 p-1">
          <svg
            fill="currentColor"
            className="w-6 h-6 text-cyan-600"
            version="1.1"
            viewBox="0 0 42 42"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon
              fillRule="evenodd"
              points="27.066,1 7,21.068 26.568,40.637 31.502,35.704 16.865,21.068 32,5.933"
            ></polygon>
          </svg>
          <span className="text-cyan-600 font-medium">Back</span>
        </button>
      </div>

      {/* Detail Utama */}
      <div className="w-full p-6 bg-white rounded-md shadow border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Request Number */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Request Number
            </label>
            <p className="text-black font-bold text-lg">
              {data.requestNumber || "-"}
            </p>
          </div>

          {/* Service Type & Date Submitted */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Service Type
            </label>
            <p className="text-black font-bold">{data.type || "-"}</p>

            <label className="block text-sm font-medium mb-2 text-gray-600 mt-4">
              Date Submitted
            </label>
            <p className="text-black font-bold">{data.dateSubmitted || "-"}</p>
          </div>

          {/* Location & Estimated Completion */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Locations
            </label>
            <p className="text-black font-bold">{data.location || "-"}</p>

            <label className="block text-sm font-medium mb-2 text-gray-600 mt-4">
              Estimated Completion Date
            </label>
            <p className="text-black font-bold">{data.dateSubmitted || "-"}</p>
          </div>

          {/* Related To */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 lg:mt-17">
              Related To
            </label>
            <p className="text-black font-bold">{data.relatedTo || "-"}</p>
          </div>

          {/* Charge To Customer & Status */}
          <div className="md:border-l-2 border-gray-300 md:pl-4 md:border-dashed">
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-600">
                  Charge To Customer
                </label>
                <p className="text-black font-medium">
                  {data.chargeToCustomer ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-600">
                  Status
                </label>
                <p className="text-black font-bold">{data.status || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inspection Scope */}
      <div className="mb-4 mt-2">
        <h2 className="text-lg font-bold mb-2 mt-2">Inspection Scope</h2>
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-sm font-medium text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left">Service Type</th>
                <th className="px-3 py-2 text-left">Scope Name</th>
                <th className="px-3 py-2 text-left">Scope Description</th>
              </tr>
            </thead>
            <tbody>
              {data.inspectionScope?.map((scopeName, i) => (
                <tr key={i} className="text-sm">
                  {i === 0 ? (
                    <td
                      className="px-3 py-2 text-black border-b border-gray-200"
                      rowSpan={data.inspectionScope.length}
                    >
                      Inspection
                    </td>
                  ) : null}
                  <td className="px-3 py-2 text-black border-gray-200">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-md shadow-sm text-xs font-medium">
                      {scopeName || "-"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-black border-gray-200">
                    Lorem ipsum dolor sit amet...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Information */}
      <div className="mb-4 mt-4">
        <h2 className="text-lg font-bold mb-2 mt-2">Order Information</h2>
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-sm font-medium text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left">Item Description</th>
                <th className="px-3 py-2 text-center">Qty</th>
              </tr>
            </thead>
            <tbody>
              {data.orderItems?.map((item, i) => {
                const selectedItem = items?.find((d) => d.id === item.itemId);

                return (
                  <React.Fragment key={i}>
                    <tr className="text-sm">
                      <td className="px-3 py-2 text-black border-b border-gray-200">
                        {selectedItem?.name || "-"}
                      </td>
                      <td className="px-3 py-2 text-center text-black border-b border-gray-200">
                        {item.qty || "-"}
                      </td>
                    </tr>

                    {item.lots?.map((lot, j) => {
                      const lotData = selectedItem?.lots?.find(
                        (l) => l.lotId === lot.lotId
                      );

                      return (
                        <tr key={j} className="text-sm bg-gray-50">
                          <td colSpan={2} className="px-3 py-2 border-b border-gray-200">
                            <div className="grid grid-cols-12 gap-2 text-sm">
                              <div className="col-span-2">
                                <p className="text-gray-600 text-xs">Allocation</p>
                                <p className="text-black">{lotData?.alokasi || "-"}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-gray-600 text-xs">Owner</p>
                                <p className="text-black">{lotData?.pemilik || "-"}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-gray-600 text-xs">Condition</p>
                                <p className="text-black">{lotData?.kondisi || "-"}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-gray-600 text-xs">Avail. Qty</p>
                                <p className="text-black">{lotData?.jumlahTersedia || "-"}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-gray-600 text-xs">Qty Required</p>
                                <p className="text-black">{lot.jumlahDibutuhkan || "-"}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-gray-600 text-xs">Inspection Req.</p>
                                <p className="text-black">
                                  {lot.inspectionRequired ? "Yes" : "No"}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charge To Customer */}
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2 mt-2">Charge To Customer</h2>
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-sm font-medium text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left">Order No</th>
                <th className="px-3 py-2 text-left">Service Description</th>
                <th className="px-3 py-2 text-center">Qty</th>
                <th className="px-3 py-2 text-center">Unit Price</th>
                <th className="px-3 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.orderItems?.map((item, i) => {
                const selectedItem = items?.find((d) => d.id === item.itemId);
                const unitPrice = selectedItem?.unitPrice || 0;
                const qty = item.qty || 0;
                const total = unitPrice * qty;

                return (
                  <tr key={i} className="text-sm">
                    <td className="px-3 py-2 text-black border-b border-gray-200">
                      {item.orderNo || `ORD-${i + 1}`}
                    </td>
                    <td className="px-3 py-2 text-black border-b border-gray-200">
                      {selectedItem?.name || "Body Repair"}
                    </td>
                    <td className="px-3 py-2 text-center text-black border-b border-gray-200">
                      {qty}
                    </td>
                    <td className="px-3 py-2 text-center text-black border-b border-gray-200">
                      {unitPrice}
                    </td>
                    <td className="px-3 py-2 text-right text-black font-semibold border-b border-gray-200">
                      {total}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailsInspection;
