import { useState, useEffect } from 'react';
import { FaSignOutAlt, FaHome, FaUsers, FaBriefcase, FaRegUserCircle } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/loader';
import Dashboard from '@/components/Dashboard';
import TotalContacts from '@/components/TotalContacts';
import Personal from '@/components/categories/Personal';
import Business from '@/components/categories/Business';
import Family from '@/components/categories/Family';

const Main: React.FC = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [color, setColor] = useState('#2DA5FC');

  const categoryComponents: Record<string, JSX.Element> = {
    Personal: <Personal />,
    Business: <Business />,
    Family: <Family />,
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let newColor = '#';
      for (let i = 0; i < 6; i++) {
        newColor += letters[Math.floor(Math.random() * 16)];
      }
      return newColor;
    };

    const interval = setInterval(() => {
      setColor(getRandomColor());
    }, 10);

    return () => clearInterval(interval);
  }, []);

  const handleCategorySelection = (category: string) => {
    setIsDropdownOpen(true);
    setActiveItem(category);
  };

  const navItems = [
    { name: 'Dashboard', component: <Dashboard onCategoryShortcutClick={handleCategorySelection} />, icon: <FaHome /> },
    { name: 'Total Contacts', component: <TotalContacts />, icon: <FaUsers /> },
  ];

  const handleNavItemClick = (itemName: string) => {
    if (activeItem === itemName) {
      setActiveItem('Dashboard');
    } else {
      setActiveItem(itemName);
      setIsDropdownOpen(false);
    }
  };

  const handleCategoryClick = () => {
    setIsDropdownOpen((prev) => !prev);
    setActiveItem(isDropdownOpen ? 'Dashboard' : 'Select category...');
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      <aside className="w-48 bg-[#CEF3FF] text-black flex justify-between flex-col p-4">
        <div className="mb-6">
          <img src="/contactDesk3.svg" alt="Contact Desk" className="w-full h-auto" />
        </div>

        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <div
              key={item.name}
              onClick={() => handleNavItemClick(item.name)}
              className={`p-2 rounded cursor-pointer transition-colors flex items-center justify-between ${
                activeItem === item.name
                  ? 'bg-[#2DA5FC] text-white'
                  : 'bg-[#CEF3FF] hover:bg-[#A0DFFC] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                {item.name}
              </div>
              {activeItem === item.name && <div className="text-xl">|</div>}
            </div>
          ))}

          <div className="bg-[#2DA5FC] rounded">
            <div
              className={`p-2 rounded cursor-pointer transition-colors flex items-center justify-between ${
                isDropdownOpen ? 'bg-[#2DA5FC] text-white' : 'bg-[#CEF3FF] hover:bg-[#A0DFFC] hover:text-white'
              }`}
              onClick={handleCategoryClick}
            >
              <div className="flex items-center gap-2">
                <FaRegUserCircle />
                Categories
              </div>
              {isDropdownOpen && <span className="text-xl">|</span>}
            </div>
            {isDropdownOpen && (
              <div className="ml-4 space-y-1 text-white bg-[#2DA5FC] rounded p-2">
                {['Personal', 'Business', 'Family'].map((category) => (
                  <div
                    key={category}
                    onClick={() => handleCategorySelection(category)}
                    className={`p-2 rounded cursor-pointer transition-colors flex items-center justify-between ${
                      activeItem === category
                        ? 'bg-[#0094FF] text-white'
                        : 'hover:bg-[#A0DFFC] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {category === 'Personal' && <FaRegUserCircle />}
                      {category === 'Business' && <FaBriefcase />}
                      {category === 'Family' && <FaUsers />}
                      {category}
                    </div>
                    {activeItem === category && <span className="text-xl">|</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        <button
          className="flex items-center justify-center rounded text-center hover:bg-[#A0DFFC] gap-2 mt-auto"
          onClick={() => logout()}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      <div className="flex flex-col flex-grow text-black">
        <header className="bg-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">{activeItem}</h1>
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div
                className="w-10 h-10 flex items-center justify-center rounded-full text-xl font-semibold transition-all duration-500"
                style={{ backgroundColor: color }}
              >
                {user.username[0]}
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 p-6 bg-[#F5F5F5] overflow-y-auto">
          {activeItem === 'Select category...' && isDropdownOpen ? (
            <Loader />
          ) : (
            navItems.find((item) => item.name === activeItem)?.component ||
            categoryComponents[activeItem] ||
            <Dashboard onCategoryShortcutClick={handleCategorySelection} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Main;
