import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaFilter, FaPlus, FaFileExport } from "react-icons/fa";

//PROGRESS
//SUCCESS DELETE SINGLE ROWS
//SUCCESS CREATION
//SUCCESS FILTERS AND DATA HANLING

//PENDING
//DELETE MULTIPLE USING CHECKBOXES
//EDITING

//OTHER PAGES
//DESIGNS AND FRONTEND STUFF :D

interface Tag {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Country {
  id: number;
  name: string;
}

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  category: number;
  country: number;
  tags: number[];
  user: number;
}

interface NewContact {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  category: number;
  country: number;
  tags: number[];
  user: number;
}

const TotalContacts: React.FC = () => {
  const [id, setId] = useState(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [newContact, setNewContact] = useState<NewContact>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    category: 0,
    country: 0,
    tags: [],
    user: id,
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : "";
    setId(userId);
  }, []);
  
  useEffect(() => {
    if (id) {
      fetchContacts();
      fetchCategories();
      fetchCountries();
      fetchTags();
    }
  }, [id]);

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

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts/categories/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      setCategories(result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts/country/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      setCountries(result);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }

  const fetchTags = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts/tags/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      setTags(result);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }

  const handleCreateClick = () => {
    setDropdownVisible(false);
    setIsCreateModalOpen(true);
    setNewContact({
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      category: 0,
      country: 0,
      tags: [],
      user: id,
    });
  };
  
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Contact
  ) => {
    setNewContact((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };
  
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      });
  
      if (response.ok) {
        const createdContact = await response.json();
        setContacts((prevContacts) => [...prevContacts, createdContact]);
        setNewContact({
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          category: 0,
          country: 0,
          tags: [],
          user: id,
        });
        setIsCreateModalOpen(false);
        alert("Contact created successfully!");
      } else {
        console.log(newContact)
        alert("Failed to create contact. Please try again.");
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      alert("Error creating contact. Please try again.");
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

  const handleFilter = (category: string) => {
    setFilterCategory(category);
    setDropdownVisible(false);
  };

  const handleResetFilters = () => {
    setFilterCategory(null); // Reset filter to show all contacts
    setDropdownVisible(false);
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

  const filteredContacts = filterCategory
    ? contacts.filter((contact) => contact.category === categories.find(category => category.name === filterCategory)?.id)
    : contacts;

  const handleDeleteRow = async (id: number) => {
    const isConfirm = confirm('Do you want to delete contact?');

    if(!isConfirm) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/contacts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if(response.ok){
        fetchContacts();
        alert("Successfully Deleted Contact");
      } else {
        alert("Failed to Delete Contact");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  }

  return (
    <div className="p-4">
      {/* Buttons */}
      <div className="flex justify-between mb-4">
      <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            <FaFilter className="mr-2" /> Filters
          </button>
          {dropdownVisible && (
            <div className="absolute bg-white border shadow-md mt-2 p-2 rounded">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className="block text-left px-4 py-2 w-full hover:bg-gray-200"
                  onClick={() => handleFilter(category.name)}
                >
                  {category.name}
                </button>
              ))}
              <button
                className="block text-left px-4 py-2 w-full hover:bg-gray-200 text-red-500"
                onClick={handleResetFilters}
              >
                Reset
              </button>
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
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleCreateClick}
          >
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
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Country</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((contact) => {
            const categoryName = categories.find((category) => category.id === contact.category)?.name || "N/A";
            const countryName = countries.find((country) => country.id === contact.country)?.name || "N/A";

            return (
              <tr key={contact.id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(contact.id)}
                    onChange={() => handleSelectRow(contact.id)}
                  />
                </td>
                <td className="px-4 py-2">
                  {contact.first_name} {contact.last_name}
                </td>
                <td className="px-4 py-2">{contact.email}</td>
                <td className="px-4 py-2">{contact.phone_number}</td>
                <td className="px-4 py-2">
                  {contact.tags
                    .map((tagId) => tags.find((tag) => tag.id === tagId)?.name)
                    .join(", ")}
                </td>
                <td className="px-4 py-2">{categoryName}</td>
                <td className="px-4 py-2">{countryName}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => alert("Edit contact")}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteRow(contact.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            );
          })}
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

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md max-w-lg w-full overflow-auto">
            <h2 className="text-xl mb-4">Create New Contact</h2>
            <div className="mb-4">
              <input
                type="text"
                id="first_name"
                value={newContact.first_name}
                placeholder="First Name"
                onChange={(e) => handleInputChange(e, "first_name")}
                className="border w-full p-2"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                id="last_name"
                value={newContact.last_name}
                placeholder="Last Name"
                onChange={(e) => handleInputChange(e, "last_name")}
                className="border w-full p-2"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                value={newContact.email}
                placeholder="Email"
                onChange={(e) => handleInputChange(e, "email")}
                className="border w-full p-2"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                id="phone_number"
                value={newContact.phone_number}
                placeholder="Phone Number"
                onChange={(e) => handleInputChange(e, "phone_number")}
                className="border w-full p-2"
              />
            </div>
            {/* Add dropdowns for category, country, and tags */}
            <div className="mb-4">
              <select
                id="category"
                value={newContact.category}
                onChange={(e) => handleInputChange(e, "category")}
                className="border w-full p-2"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <select
                id="country"
                value={newContact.country}
                onChange={(e) => handleInputChange(e, "country")}
                className="border w-full p-2"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
            <select
              id="tags"
              multiple
              value={newContact.tags.map((tag) => tag.toString())}
              onChange={(e) => {
                const selectedTagIds = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
                setNewContact((prev) => ({
                  ...prev,
                  tags: selectedTagIds,
                }));
              }}
              className="border w-full p-2"
            >
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id.toString()}>{tag.name}</option>
              ))}
            </select>
            </div>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => {
                  setNewContact({ ...newContact, first_name: "", last_name: "" });
                  setIsCreateModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                Create Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalContacts;
