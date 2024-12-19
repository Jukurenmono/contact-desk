import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaFilter, FaPlus, FaFileExport } from "react-icons/fa";

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

const Business: React.FC = () => {
  const [id, setId] = useState(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingContact, setEditingContact] = useState<Contact | null>(null);

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

  const categoryTagMap: Record<number, number[]> = {
    1: [4, 5, 6, 7, 8, 9],
    2: [10, 11],
    3: [13, 14, 15],
  };

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

  useEffect(() => {
    setNewContact((prev) => ({
      ...prev,
      tags: [],
    }));
  }, [newContact.category]);

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      const filteredContacts = result.filter(
        (contact: Contact) => contact.user === id && contact.category === 2
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

  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Contact
  ) => {
    if (editingContact) {
      setEditingContact({
        ...editingContact,
        [field]: event.target.value,
      });
    }
  };

  const handleEditCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = parseInt(e.target.value);
    setEditingContact((prev) => {
      if (!prev) return prev;
  
      return {
        ...prev,
        category: newCategory,
        tags: [],
      };
    });
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

  const handleUpdateContact = async () => {
    if (!editingContact) return;
    console.log(editingContact);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/contacts/${editingContact.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingContact),
        }
      );
  
      if (response.ok) {
        fetchContacts();
        setShowEditModal(false);
        setEditingContact(null);
        alert("Contact updated successfully!");
      } else {
        alert("Failed to update contact.");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("Error occurred while updating.");
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

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setShowEditModal(true);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingContact(null);
  };

  const handleDelete = () => {
    setShowConfirmation(true);
  };

const confirmDelete = async () => {
  try {
    const deletePromises = selectedRows.map((id) =>
      fetch(`http://127.0.0.1:8000/api/contacts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
    );

    const responses = await Promise.all(deletePromises);

    const allSuccess = responses.every((response) => response.ok);

    if (allSuccess) {
      fetchContacts();
      setSelectedRows([]);
      setShowConfirmation(false);
      alert("Successfully Deleted Contact/s");
    } else {
      alert("Failed to Delete Some Contact/s");
    }
  } catch (error) {
    console.error("Error deleting contact/s:", error);
    alert("An error occurred while deleting contact/s.");
  }
};


const exportToCSV = () => {
  const categoryLookup = categories.reduce((acc, category) => {
    acc[category.id] = category.name;
    return acc;
  }, {} as Record<number, string>);

  const countryLookup = countries.reduce((acc, country) => {
    acc[country.id] = country.name;
    return acc;
  }, {} as Record<number, string>);

  const tagLookup = tags.reduce((acc, tag) => {
    acc[tag.id] = tag.name;
    return acc;
  }, {} as Record<number, string>);

  const csvContent = [
    ["First Name", "Last Name", "Email", "Phone Number", "Tags", "Category", "Country"],
    ...contacts.map((contact) => [
      contact.first_name,
      contact.last_name,
      contact.email,
      contact.phone_number,
      contact.tags.map((tagId) => tagLookup[tagId] || tagId).join(", "),
      categoryLookup[contact.category] || contact.category,
      countryLookup[contact.country] || contact.country,
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


const filteredContacts = contacts
.filter((contact) => {
  const matchesSearch = (
    contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return matchesSearch;
});


    const filteredTags = categoryTagMap[newContact.category] 
  ? tags.filter((tag) => categoryTagMap[newContact.category].includes(tag.id)) 
  : tags;

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
    <div>
      {/* Buttons */}
      <div className="flex justify-between h-8 mb-4">
      <div className="flex space-x-2">
      <div className="flex items-center space-x-2">
        <label className="items-center text-center">
          Search:
        </label>
        <input
          type="text"
          placeholder="Search Name or #"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-2 py-1 border-gray-400"
        />
      </div>
      </div>
      <div className="flex space-x-2">
        <button
          className="flex bg-red-500 text-white px-2 py-1 rounded items-center"
          onClick={handleDelete}
          disabled={selectedRows.length === 0}
        >
          <FaTrash className="mr-2"/>
          Delete
        </button>
        <button
          className="flex bg-green-500 text-white px-2 py-1 rounded items-center"
          onClick={handleCreateClick}
        >
          <FaPlus className="mr-2" /> Create
        </button>
        <button
          className="flex bg-yellow-500 text-white px-2 py-1 rounded items-center"
          onClick={exportToCSV}
        >
          <FaFileExport className="mr-2" /> Export
        </button>
      </div>
    </div>

    {/* Table */}
    <table className="table-auto text-center items-center text-sm w-full bg-white shadow rounded font-titillium">
      <thead className="bg-[#B2DFFF] text-[#38322C]">
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
                  onClick={() => handleEdit(contact)}
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
          <div className="bg-white p-4 rounded shadow-md max-w-3xl w-full overflow-auto">
            <h2 className="text-lg mb-3 text-center">Create New Contact</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* First Column */}
              <div>
                <div className="mb-3">
                  <input
                    type="text"
                    id="first_name"
                    value={newContact.first_name}
                    placeholder="First Name"
                    onChange={(e) => handleInputChange(e, "first_name")}
                    className="border w-full p-2 rounded"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    id="last_name"
                    value={newContact.last_name}
                    placeholder="Last Name"
                    onChange={(e) => handleInputChange(e, "last_name")}
                    className="border w-full p-2 rounded"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    id="email"
                    value={newContact.email}
                    placeholder="Email"
                    onChange={(e) => handleInputChange(e, "email")}
                    className="border w-full p-2 rounded"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    id="phone_number"
                    value={newContact.phone_number}
                    placeholder="Phone Number"
                    onChange={(e) => handleInputChange(e, "phone_number")}
                    className="border w-full p-2 rounded"
                  />
                </div>
              </div>

              {/* Second Column */}
              <div>
                <div className="mb-3">
                  <div className="mb-3">
                    <select
                      id="category"
                      value={newContact.category}
                      onChange={(e) => handleInputChange(e, "category")}
                      className="border w-full p-2 rounded"
                    >
                      <option value="">Select Category</option>
                      {categories
                      .filter((category) => category.name === "Business")
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <select
                      id="country"
                      value={newContact.country}
                      onChange={(e) => handleInputChange(e, "country")}
                      className="border w-full p-2 rounded"
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 block">Tags:</label>
                    <select
                      id="tags"
                      disabled = {newContact.category == 0}
                      value={newContact.tags.map((tag) => tag.toString())}
                      onChange={(e) => {
                        const selectedTagIds = Array.from(e.target.selectedOptions, (option) =>
                          parseInt(option.value)
                        );
                        setNewContact((prev) => ({
                          ...prev,
                          tags: selectedTagIds,
                        }));
                      }}
                      className="border w-full p-2 rounded"
                    >
                      {filteredTags.map((tag) => (
                        <option key={tag.id} value={tag.id.toString()}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button
                    className="bg-gray-300 text-black px-3 py-1 rounded"
                    onClick={() => {
                      setNewContact({ ...newContact, first_name: "", last_name: "" });
                      setIsCreateModalOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={handleSubmit}
                  >
                    Create Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {showEditModal && editingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md max-w-3xl w-full overflow-auto">
            <h2 className="text-lg mb-3 text-center">Edit Contact</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* First Column */}
              <div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={editingContact.first_name}
                    onChange={(e) => handleEditInputChange(e, "first_name")}
                    className="border w-full p-2 rounded"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={editingContact.last_name}
                    onChange={(e) => handleEditInputChange(e, "last_name")}
                    className="border w-full p-2 rounded"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={editingContact.email}
                    onChange={(e) => handleEditInputChange(e, "email")}
                    className="border w-full p-2 rounded"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={editingContact.phone_number}
                    onChange={(e) => handleEditInputChange(e, "phone_number")}
                    className="border w-full p-2 rounded"
                  />
                </div>
              </div>

              {/* Second Column */}
              <div>
                <div className="mb-3">
                  <select
                    id="category"
                    value={editingContact.category}
                    onChange={handleEditCategoryChange}  // Update the handler
                    className="border w-full p-2 rounded"
                  >
                    <option value="">Select Category</option>
                    {categories
                      .filter((category) => category.name === "Business")
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-3">
                  <select
                    id="country"
                    value={editingContact.country}
                    onChange={(e) => handleEditInputChange(e, "country")}
                    className="border w-full p-2 rounded"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="mb-2 block">Tags:</label>
                <select
                  id="tags"
                  disabled={editingContact.category === 0}
                  value={editingContact?.tags.map((tag) => tag.toString()) || []}
                  onChange={(e) => {
                    const selectedTagIds = Array.from(e.target.selectedOptions, (option) =>
                      parseInt(option.value)
                    );

                    if (editingContact) {
                      setEditingContact((prev) => ({
                        ...prev!,
                        tags: selectedTagIds,
                      }));
                    }
                  }}
                  className="border w-full p-2 rounded"
                >
                  {(editingContact.category
                    ? categoryTagMap[editingContact.category] || []
                    : []
                  ).map((tagId) => (
                    <option key={tagId} value={tagId.toString()}>
                      {tags.find((tag) => tag.id === tagId)?.name || "Unknown Tag"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-8">
              <button
                className="bg-gray-300 text-black px-3 py-1 rounded"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleUpdateContact}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Business;
