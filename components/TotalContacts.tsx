import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaFilter, FaPlus, FaFileExport } from "react-icons/fa";

interface Tag {
  id: number;
  name: string;
}

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  tags: Tag[];
  user: number;
}

const TotalContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [filterTags, setFilterTags] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false); // for controlling the dropdown visibility

  const user = localStorage.getItem("user");
  const id = user ? JSON.parse(user).id : "";

  const predefinedTags = ["Personal", "Business", "Family"]; // Predefined tags for filtering

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      const filteredContacts = result.filter(
        (contact: Contact) => contact.user === id
      );

      setContacts(filteredContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(contacts.map((contact) => contact.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleFilter = (tag: string) => {
    setFilterTags(tag);
    setDropdownVisible(false); // Close the dropdown after selecting a filter
  };

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    const remainingContacts = contacts.filter(
      (contact) => !selectedRows.includes(contact.id)
    );
    setContacts(remainingContacts);
    setSelectedRows([]);
    setShowConfirmation(false);
  };

  const exportToCSV = () => {
    const csvContent = [
      ["First Name", "Last Name", "Email", "Phone Number", "Tags"],
      ...contacts.map((contact) => [
        contact.first_name,
        contact.last_name,
        contact.email,
        contact.phone_number,
        contact.tags.join(", "),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contacts.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredContacts = filterTags
    ? contacts.filter((contact) =>
        contact.tags.some((tag) => tag.name === filterTags)
      )
    : contacts;

  return (
    <div className="p-4">
      {/* Buttons */}
      <div className="flex justify-between mb-4">
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={() => setDropdownVisible(!dropdownVisible)} // Toggle dropdown visibility
          >
            <FaFilter className="mr-2" /> Filters
          </button>
          {dropdownVisible && (
            <div className="absolute bg-white border shadow-md mt-2 p-2 rounded">
              {predefinedTags.map((tag) => (
                <button
                  key={tag}
                  className="block text-left px-4 py-2 hover:bg-gray-200"
                  onClick={() => handleFilter(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleDelete}
            disabled={selectedRows.length === 0}
          >
            Delete
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            <FaPlus className="mr-2" /> Create
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={exportToCSV}
          >
            <FaFileExport className="mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="table-auto w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedRows.length === contacts.length && contacts.length > 0}
              />
            </th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone Number</th>
            <th className="px-4 py-2">Tags</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((contact) => (
            <tr key={contact.id} className="border-b">
              <td className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(contact.id)}
                  onChange={() => handleSelectRow(contact.id)}
                />
              </td>
              <td className="px-4 py-2">{`${contact.first_name} ${contact.last_name}`}</td>
              <td className="px-4 py-2">{contact.email}</td>
              <td className="px-4 py-2">{contact.phone_number}</td>
              <td className="px-4 py-2">{contact.tags.map((tag) => tag.name).join(", ")}</td>
              <td className="px-4 py-2 text-center">
                <button className="text-blue-500 mr-2">
                  <FaEdit />
                </button>
                <button className="text-red-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md">
            <p>Are you sure you want to delete the selected contacts?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={confirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalContacts;
