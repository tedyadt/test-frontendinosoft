import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "preline";

const inputClass =
  "py-3 px-4 pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-100 dark:border-transparent dark:text-neutral-500 dark:focus:ring-neutral-600";

export default function CreateRequestForm({ onSubmit }) {
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
  });

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
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
        setSearch(""); // reset pencarian
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (open && e.key.length === 1) {
        setSearch((prev) => prev + e.key); // ketik huruf
      }
      if (open && e.key === "Backspace") {
        setSearch((prev) => prev.slice(0, -1));
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

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

  const handleSubmit = () => {
    if (!form.location || !form.type || !form.relatedTo) {
      alert("Lengkapi semua field utama!");
      return;
    }
    if (onSubmit) onSubmit(form);
    console.log(form);
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
  const closeSelect = () => setOpen(false);

  const handleSelect = (option) => {
    if (!selected.includes(option)) {
      setSelected([...selected, option]);
    }
  };

  const removeOption = (option) => {
    setSelected(selected.filter((item) => item !== option));
  };

  return (
    <div className="w-full p-4 bg-white rounded-md shadow">
      <h2 className="text-xl font-bold mb-4">Create Request</h2>
      <div className="grid grid-cols-5 grid-rows-5 gap-4">
        <div>
          <label
            for="select-1"
            class="block text-sm font-medium mb-2 dark:text-black"
          >
            Service Type
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={inputClass}
          >
            <option value="">Select Type</option>
            <option value="Pendatang Baru">Pendatang Baru</option>
            <option value="Pemeliharaan">Pemeliharaan</option>
            <option value="Di Tempat">Di Tempat</option>
          </select>
        </div>
        <div>
          <label
            for="select-1"
            class="block text-sm font-medium mb-2 dark:text-black"
          >
            Request Number
          </label>
          <input
            type="text"
            value={form.requestNumber}
            onChange={(e) =>
              setForm({ ...form, requestNumber: e.target.value })
            }
            placeholder="Request Number"
            className={inputClass}
          />
        </div>
        <div className="col-span-3 col-start-1 row-start-2 " ref={dropdownRef}>
          <label
            htmlFor="inspection-scope"
            className="block text-sm font-medium mb-2 dark:text-black"
          >
            Inspection Scope of Work
          </label>
          <div className="relative w-full border bg-white border-gray-200 rounded-md p-2 flex items-center justify-between bg">
            <div
              onClick={toggleSelect}
              className=" bg-gray-100 border-transparent rounded-lg p-2 flex justify-between items-center cursor-pointer"
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
            <div className="flex flex-wrap gap-2 justify-end">
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

        <div className="col-start-3 row-start-1">7</div>
        <div className="col-start-1 row-start-3  mt-2">
          <label
            for="select-1"
            class="block text-sm font-medium mb-2 dark:text-black"
          >
            Locations
          </label>
          <select
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
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
        <div className="col-start-2 row-start-3 mt-2">
          <label
            for="select-1"
            class="block text-sm font-medium mb-2 dark:text-black"
          >
            Estimated Completion Date
          </label>
          <input
            type="date"
            value={form.dateSubmitted}
            onChange={(e) =>
              setForm({ ...form, dateSubmitted: e.target.value })
            }
            className={inputClass}
          />
        </div>
        <div className="col-start-3 row-start-3 mt-2">
          <label
            for="select-1"
            class="block text-sm font-medium mb-2 dark:text-black"
          >
            Related To
          </label>
          <select
            value={form.relatedTo}
            onChange={(e) => setForm({ ...form, relatedTo: e.target.value })}
            className={inputClass}
          >
            <option value="">Select Related To</option>
            {dropdowns.relatedTo?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2 col-start-5 row-span-5 border-l-2 border-gray-300 pl-4 border-dashed -ml-20">
          <div className="flex gap-8 ml-4">
            {/* Charge To Customer */}
            <div>
              <label
                htmlFor="select-1"
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
                <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-cyan-600 dark:bg-gray-300 dark:peer-checked:bg-cyan-500 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-6 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white"></span>
              </label>
            </div>

            {/* Status */}
            <div className="ml-6">
              <label
                htmlFor="select-1"
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
          <div className="mt-4 pl-4">
            <div className="col-start-1 row-start-3 mt-2">
              <label
                for="select-1"
                class="block text-sm font-medium mb-2 dark:text-black"
              >
                Locations
              </label>
              <select
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
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
            const selectedItem = dropdowns.items?.find(
              (d) => d.id === item.itemId
            );

            return (
              <div key={i} className="border-1 border-gray-200 ">
                {/* Item Row */}
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-9 px-3 py-2">
                    <select
                      value={item.itemId}
                      onChange={(e) => {
                        const copy = [...form.orderItems];
                        copy[i].itemId = e.target.value;
                        copy[i].lots = [];
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
                      <div className="col-span-2">
                        <label
                          htmlFor="lot-selection"
                          className="block text-sm font-medium mb-2 dark:text-black"
                        >
                          Lot Selection
                        </label>
                        <div className="relative">
                          <select
                            id="lot-selection"
                            value={lot.lotId}
                            onChange={(e) => {
                              const copy = [...form.orderItems];
                              copy[i].lots[j].lotId = e.target.value;
                              setForm({ ...form, orderItems: copy });
                            }}
                            className={inputClass + " pr-10"} // padding kanan lebih besar biar aman
                          >
                            <option value=""></option>
                            {selectedItem?.lots?.map((l) => (
                              <option key={l.lotId} value={l.lotId}>
                                {l.lotId}
                              </option>
                            ))}
                          </select>
                          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="allocation"
                          className="block text-sm font-medium mb-2 dark:text-black"
                        >
                          Allocation
                        </label>
                        <div className="relative">
                          <input
                            id="allocation"
                            className={inputClass + " pr-10"}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="owner"
                          className="block text-sm font-medium mb-2 dark:text-black"
                        >
                          Owner
                        </label>
                        <div className="relative">
                          <input
                            id="owner"
                            className={inputClass + " pr-10"}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="condition"
                          className="block text-sm font-medium mb-2 dark:text-black"
                        >
                          Condition
                        </label>
                        <div className="relative">
                          <input
                            id="condition"
                            className={inputClass + " pr-10"}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <label
                          for="select-1"
                          class="block text-sm font-medium mb-2 dark:text-black"
                        >
                          Avail. Qty
                        </label>
                        <input
                          disabled
                          value={lotData?.jumlahTersedia || ""}
                          placeholder="Enter. Qty"
                          className={inputClass}
                        />
                      </div>
                      <div className="col-span-2">
                        <label
                          for="select-1"
                          class="block text-sm font-medium mb-2 dark:text-black"
                        >
                          Qty Required
                        </label>
                        <input
                          type="number"
                          value={lot.jumlahDibutuhkan}
                          onChange={(e) => {
                            const copy = [...form.orderItems];
                            copy[i].lots[j].jumlahDibutuhkan = Number(
                              e.target.value
                            );
                            setForm({ ...form, orderItems: copy });
                          }}
                          placeholder="Qty Required"
                          className={inputClass}
                        />
                      </div>
                      <div className="col-span-1 text-left ">
                        <label
                          for="select-1"
                          class="block text-sm font-medium mb-2 dark:text-black"
                        >
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
          <div className="flex justify-end px-3 py-2 ">
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
    </div>
  );
}
