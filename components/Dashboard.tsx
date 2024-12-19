import React, { useEffect, useState } from 'react';
import { FaUsers, FaBriefcase, FaRegUserCircle } from 'react-icons/fa';

interface DashboardProps {
  onCategoryShortcutClick: (category: string) => void;
}

interface Contact {
  id: number;
  name: string;
  category: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onCategoryShortcutClick }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [categoryCounts, setCategoryCounts] = useState({
    Family: 0,
    Business: 0,
    Personal: 0,
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result: Contact[] = await response.json();
      setContacts(result);
      categorizeContacts(result);

      console.log(result); // This logs the fetched contacts to the console for debugging
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // Categorize contacts based on the category ID
  const categorizeContacts = (contacts: Contact[]) => {
    const counts = { Family: 0, Business: 0, Personal: 0 };

    contacts.forEach((contact) => {
      // Check category ID (1: Family, 2: Business, 3: Personal)
      if (contact.category === 1) {
        counts.Family++;
      } else if (contact.category === 2) {
        counts.Business++;
      } else if (contact.category === 3) {
        counts.Personal++;
      }
    });

    setCategoryCounts(counts);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-8">
      <h1 className="text-black text-3xl font-titillium font-semibold">Categories</h1>

      <div className="flex justify-center space-x-8 w-full">

        <div
          onClick={() => onCategoryShortcutClick('Personal')}
          className="w-1/3 h-60 bg-yellow-500 text-white flex items-center justify-center rounded-lg shadow-lg cursor-pointer hover:bg-yellow-600 transition-all"
        >
          <div className="flex items-center gap-4">
            <FaRegUserCircle size={30} /> {/* Personal Icon */}
            <div>
              <h2 className="text-2xl">Personal</h2>
              <p className="text-xl">{categoryCounts.Personal} Contacts</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => onCategoryShortcutClick('Business')}
          className="w-1/3 h-60 bg-green-500 text-white flex items-center justify-center rounded-lg shadow-lg cursor-pointer hover:bg-green-600 transition-all"
        >
          <div className="flex items-center gap-4">
            <FaBriefcase size={30} /> {/* Business Icon */}
            <div>
              <h2 className="text-2xl">Business</h2>
              <p className="text-xl">{categoryCounts.Business} Contacts</p>
            </div>
          </div>
        </div>
        
        <div
          onClick={() => onCategoryShortcutClick('Family')}
          className="w-1/3 h-60 bg-blue-500 text-white flex items-center justify-center rounded-lg shadow-lg cursor-pointer hover:bg-blue-600 transition-all"
        >
          <div className="flex items-center gap-4">
            <FaUsers size={30} /> {/* Family Icon */}
            <div>
              <h2 className="text-2xl">Family</h2>
              <p className="text-xl">{categoryCounts.Family} Contacts</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
