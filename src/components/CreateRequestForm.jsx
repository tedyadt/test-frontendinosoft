import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "preline";

const inputClass =
  "py-3 px-4 pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-100 dark:border-transparent dark:text-neutral-500 dark:focus:ring-neutral-600";

export default function CreateRequestForm({ onSubmit, onCancel, onBack }) {
  const [dropdowns, setDropdowns] = useState({
    locations: [],
    relatedTo: [],
    items: [],
  });

  const [form, setForm] = useState({
    requestNumber: `REQ-${Date.now()}`,
    location: "",
    type: "",
    dateSubmitted: new Date().toISOString().slice(0, 10),
    relatedTo: "",
    status: "Baru",
    orderItems: [],
    inspectionScope: [], // ✅ simpan hasil multi select
  });

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const dropdownRef = useRef(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    axios
      .get("/mock-dropdowns.json")
      .then((res) => {
        setDropdowns(res.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (open && e.key.length === 1) {
        setSearch((prev) => prev + e.key);
      }
      if (open && e.key === "Backspace") {
        setSearch((prev) => prev.slice(0, -1));
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // ✅ sinkronkan selected ke form
  useEffect(() => {
    setForm((prev) => ({ ...prev, inspectionScope: selected }));
  }, [selected]);

  const addItem = () => {
    setForm({
      ...form,
      orderItems: [...form.orderItems, { itemId: "", lots: [] }],
    });
  };

  const removeItem = (i) => {
    const copy = [...form.orderItems];
    copy.splice(i, 1);
    setForm({ ...form, orderItems: copy });
  };

  const addLot = (itemIndex) => {
    const copy = [...form.orderItems];
    copy[itemIndex].lots.push({ lotId: "", jumlahDibutuhkan: 1 });
    setForm({ ...form, orderItems: copy });
  };

  const removeLot = (itemIndex, lotIndex) => {
    const copy = [...form.orderItems];
    copy[itemIndex].lots.splice(lotIndex, 1);
    setForm({ ...form, orderItems: copy });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);

    // Simpan ke localStorage
    const prev = JSON.parse(localStorage.getItem("requests") || "[]");
    localStorage.setItem("requests", JSON.stringify([...prev, form]));
    if (onSubmit) onSubmit(form);

    // Tampilkan alert via state
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  function showSuccessAlert() {
    const alertBox = document.getElementById("success-alert");
    alertBox.classList.remove("hidden");

    // Otomatis hilang setelah 3 detik
    setTimeout(() => {
      alertBox.classList.add("hidden");
    }, 5000);
  }

  const handleCancel = () => {
    setForm({
      requestNumber: `REQ-${Date.now()}`,
      location: "",
      type: "",
      dateSubmitted: new Date().toISOString().slice(0, 10),
      relatedTo: "",
      status: "Baru",
      orderItems: [],
      inspectionScope: [],
    });
  };

  const options = [
    "Visual Body",
    "Visual Thread",
    "Functional Check",
    "Dimensional Check",
    "NDT Check",
  ];

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = () => setOpen(!open);
  const handleSelect = (option) => {
    // ✅ toggle (klik ulang = hapus)
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };
  const removeOption = (option) => {
    setSelected(selected.filter((item) => item !== option));
  };

  return (
    <div className="w-full p-4 bg-white rounded-md shadow">
      <button
          onClick={onBack}
          className="flex items-center gap-2 p-1 mb-4"
        >
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
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        {showAlert && (
          <div
            className="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 fixed top-4 right-4"
            role="alert"
          >
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

        {/* Form Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Service Type */}
          <div>
            <label
              htmlFor="service-type"
              className="block text-sm font-medium mb-2 dark:text-black"
            >
              Service Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Pilih Tipe</option>
              <option value="Pendatang Baru">Pendatang Baru</option>
              <option value="Pemeliharaan">Pemeliharaan</option>
              <option value="Di Tempat">Di Tempat</option>
            </select>
          </div>

          {/* Request Number */}
          <div>
            <label
              htmlFor="request-number"
              className="block text-sm font-medium mb-2 dark:text-black"
            >
              Request Number
            </label>
            <input
              type="text"
              name="requestNumber"
              value={form.requestNumber}
              onChange={handleChange}
              className={inputClass}
              placeholder="Request Number"
            />
          </div>

          {/* Inspection Scope */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 lg:col-start-1 lg:row-start-2">
            <label
              htmlFor="inspection-scope"
              className="block text-sm font-medium mb-2 dark:text-black"
            >
              Inspection Scope of Work
            </label>
            <div className="relative w-full border bg-white border-gray-200 rounded-md p-2">
              <div
                onClick={toggleSelect}
                className="bg-gray-100 rounded-lg p-2 flex justify-between items-center cursor-pointer"
              >
                <span className="text-gray-700">
                  {selected.length
                    ? selected.join(", ")
                    : "Select Inspection Scope"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 
             1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Dropdown Menu */}
              {open && (
                <div
                  className="absolute mt-2 w-full bg-gray-100 border border-gray-300 rounded-md shadow-lg z-10"
                  ref={dropdownRef}
                >
                  <ul className="max-h-40 overflow-y-auto">
                    {filteredOptions.map((option) => (
                      <li
                        key={option}
                        onClick={() => handleSelect(option)}
                        className={`p-2 hover:bg-blue-100 cursor-pointer ${
                          selected.includes(option) ? "bg-blue-200" : ""
                        }`}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selected.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center bg-gray-300 dark:text-neutral-900 px-2 py-1 rounded-full"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => removeOption(tag)}
                      className="ml-2 text-cyan-500 hover:text-cyan-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className="col-span-1 sm:col-span-1 lg:col-start-1 lg:row-start-3">
            <label
              htmlFor="location"
              className="block text-sm font-medium mb-2 dark:text-black"
            >
              Locations
            </label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Pilih Lokasi</option>
              {dropdowns.locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Estimated Completion Date */}
          <div className="col-span-1 sm:col-span-1 lg:col-start-2 lg:row-start-3">
            <label
              htmlFor="dateSubmitted"
              className="block text-sm font-medium mb-2 dark:text-black"
            >
              Estimated Completion Date
            </label>
            <input
              type="date"
              name="dateSubmitted"
              value={form.dateSubmitted}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Related To */}
          <div className="col-span-1 sm:col-span-1 lg:col-start-3 lg:row-start-3">
            <label
              htmlFor="relatedTo"
              className="block text-sm font-medium mb-2 dark:text-black"
            >
              Related To
            </label>
            <select
              name="relatedTo"
              value={form.relatedTo}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Pilih Project</option>
              {dropdowns.relatedTo.map((rel) => (
                <option key={rel.id} value={rel.id}>
                  {rel.name}
                </option>
              ))}
            </select>
          </div>

          {/* Charge To Customer + Status */}
          <div className="lg:col-span-2 lg:row-span-5 lg:border-l-2 lg:border-gray-300 lg:pl-4 lg:border-dashed lg:ml-auto">
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-8 justify-end">
              {/* Charge To Customer */}
              <div>
                <label
                  htmlFor="hs-md-switch"
                  className="block text-sm font-medium mb-2 dark:text-black"
                >
                  Charge To Customer
                </label>
                <label
                  htmlFor="hs-md-switch"
                  className="relative inline-block w-13 h-7 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="hs-md-switch"
                    className="peer sr-only"
                  />
                  <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-cyan-600"></span>
                  <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-6 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
                </label>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium mb-2 dark:text-black"
                >
                  Status
                </label>
                <input
                  type="text"
                  value={form.status}
                  readOnly
                  className={inputClass}
                />
              </div>
              
            </div>

            {/* Field lain di bawah */}
            <div className="mt-4">
              <div className="col-start-1 row-start-3 mt-2">
                <label
                  for="select-1"
                  class="block text-sm font-medium mb-2 dark:text-black"
                >
                  Locations
                </label>
                <select
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">Select Location</option>
                  {dropdowns.locations?.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Pesanan */}
        <div className="mb-6">
  <h2 className="text-xl font-bold mb-4">Order Information</h2>

  <div className="rounded-lg overflow-hidden">
    {/* Header */}
    <div className="grid grid-cols-12 bg-gray-200 text-sm font-medium text-gray-700 border-b border-gray-200">
      <div className="col-span-9 px-3 py-2">Item Description</div>
      <div className="col-span-3 px-3 py-2">Qty</div>
    </div>

    {form.orderItems.map((item, i) => {
      const selectedItem = dropdowns.items?.find((d) => d.id === item.itemId);

      return (
        <div key={i} className="border-1 border-gray-200">
          {/* Item Row */}
          <div className="grid grid-cols-12 items-center">
            <div className="col-span-9 px-3 py-2">
              <select
                value={item.itemId}
                onChange={(e) => {
                  const copy = [...form.orderItems];
                  copy[i].itemId = e.target.value;
                  copy[i].lots = []; // reset lot kalau ganti item
                  setForm({ ...form, orderItems: copy });
                }}
                className={inputClass}
              >
                <option value="">Select an item</option>
                {dropdowns.items?.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3 px-3 py-2">
              <input
                type="number"
                placeholder="Enter Qty"
                className={inputClass}
              />
            </div>
          </div>

          {/* Lots Details */}
          {item.lots.map((lot, j) => {
            const lotData = selectedItem?.lots.find(
              (l) => l.lotId === lot.lotId
            );
            return (
              <div
                key={j}
                className="grid grid-cols-12 gap-2 px-3 py-2 text-sm items-center"
              >
                {/* Pilih Lot */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 dark:text-black">
                    Lot
                  </label>
                  <select
                    value={lot.lotId}
                    onChange={(e) => {
                      const copy = [...form.orderItems];
                      copy[i].lots[j].lotId = e.target.value;
                      setForm({ ...form, orderItems: copy });
                    }}
                    className={inputClass}
                  >
                    <option value="">Select Lot</option>
                    {selectedItem?.lots.map((l) => (
                      <option key={l.lotId} value={l.lotId}>
                        {l.lotId}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Allocation */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 dark:text-black">
                    Allocation
                  </label>
                  <input
                    disabled
                    value={lotData?.alokasi || ""}
                    className="py-3 px-4 pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-100 dark:border-transparent dark:text-black dark:focus:ring-neutral-600"
                  />
                </div>

                {/* Owner */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 dark:text-black">
                    Owner
                  </label>
                  <input
                    disabled
                    value={lotData?.pemilik || ""}
                    className="py-3 px-4 pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-100 dark:border-transparent dark:text-black dark:focus:ring-neutral-600"
                  />
                </div>

                {/* Condition */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 dark:text-black">
                    Condition
                  </label>
                  <input
                    disabled
                    value={lotData?.kondisi || ""}
                    className="py-3 px-4 pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-100 dark:border-transparent dark:text-black dark:focus:ring-neutral-600"
                  />
                </div>

                {/* Avail Qty */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-2 dark:text-black">
                    Avail. Qty
                  </label>
                  <input
                    disabled
                    value={lotData?.jumlahTersedia || ""}
                    className="py-3 px-4 pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-100 dark:border-transparent dark:text-black dark:focus:ring-neutral-600"
                  />
                </div>

                {/* Qty Required */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 dark:text-black">
                    Qty Required
                  </label>
                  <input
                    type="number"
                    value={lot.jumlahDibutuhkan || ""}
                    onChange={(e) => {
                      const copy = [...form.orderItems];
                      copy[i].lots[j].jumlahDibutuhkan = Number(e.target.value);
                      setForm({ ...form, orderItems: copy });
                    }}
                    className={inputClass}
                  />
                </div>

                {/* Checkbox Inspection */}
                <div className="col-span-1 text-left">
                  <label className="block text-sm font-medium mb-2 dark:text-black">
                    Inspection Required
                  </label>
                  <input type="checkbox" />
                </div>
              </div>
            );
          })}

          {/* Action Row */}
          <div className="flex justify-end gap-2 px-3 py-2">
            <button
              type="button"
              onClick={() => addLot(i)}
              className="px-3 py-1 bg-cyan-600 text-white rounded text-sm"
            >
              + Lot
            </button>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      );
    })}

    {/* Add Item */}
    <div className="flex justify-end px-3 py-2">
      <button
        type="button"
        onClick={addItem}
        className="px-3 py-1 bg-cyan-600 text-white rounded text-sm"
      >
        + Add Item
      </button>
    </div>
  </div>
</div>

        <div class="w-full space-y-3">
          <h2 className="text-xl font-bold mb-4">Note to Yard</h2>
          <textarea
            class="py-2 px-3 sm:py-3 sm:px-4 block w-full bg-gray-100 border-transparent rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-200 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            rows="3"
            placeholder="This is a textarea placeholder"
          ></textarea>
        </div>
        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
