import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import TotalContacts from '@/components/TotalContacts';
import Personal from '@/components/categories/Personal';
import Business from '@/components/categories/Business';
import Family from '@/components/categories/Family';
import Loader from '@/components/loader';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

const Main: React.FC = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', component: <Dashboard /> },
    { name: 'Total Contacts', component: <TotalContacts /> },
  ];

  const categoryComponents: Record<string, JSX.Element> = {
    Personal: <Personal />, 
    Business: <Business />, 
    Family: <Family />,
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      {/* Sidebar */}
      <aside className="w-48 bg-[#CEF3FF] text-black flex justify-between flex-col p-4">
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <div
              key={item.name}
              onClick={() => {
                setActiveItem(item.name)
                setIsDropdownOpen(false);
              }}
              className={`p-2 rounded cursor-pointer transition-colors ${
                activeItem === item.name
                  ? 'bg-[#2DA5FC] text-white'
                  : 'bg-[#CEF3FF] hover:bg-[#A0DFFC] hover:text-white'
              }`}
            >
              {item.name}
            </div>
          ))}

          {/* Categories Dropdown */}
          <div className="bg-[#2DA5FC] rounded">
            <div
              className={`p-2 rounded cursor-pointer transition-colors ${
                isDropdownOpen ? 'bg-[#2DA5FC] text-white' : 'bg-[#CEF3FF] hover:bg-[#A0DFFC] hover:text-white'
              }`}
              onClick={() => {
                setIsDropdownOpen(true);
                setActiveItem('Loading...');
              }}
            >
              Categories
            </div>
            {isDropdownOpen && (
              <div className="ml-4 space-y-1 text-white bg-[#2DA5FC] rounded p-2">
                {['Personal', 'Business', 'Family'].map((category) => (
                  <div
                    key={category}
                    onClick={() => setActiveItem(category)}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      activeItem === category
                        ? 'bg-[#0094FF] text-white'
                        : 'hover:bg-[#A0DFFC] hover:text-white'
                    }`}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
        <button
          className="flex items-center justify-center rounded text-center hover:bg-[#A0DFFC] gap-2"
          onClick={() => logout()}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>
      <div className="flex flex-col flex-grow text-black">
        <header className="bg-white p-4">
          <h1 className="text-xl font-semibold">{activeItem}</h1>
        </header>
        <main className="flex-1 p-6 bg-[#F5F5F5] overflow-y-auto">
          {activeItem === 'Loading...' && isDropdownOpen ? (
            <Loader />
          ) : (
            navItems.find((item) => item.name === activeItem)?.component || categoryComponents[activeItem] || <div>{activeItem}</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Main;