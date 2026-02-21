import React,{useState, useEffect} from 'react'
// import { Home, Zap, Settings, Users } from 'lucide-react'
import { BiSolidCricketBall } from "react-icons/bi";
import { FaRegCirclePlay } from "react-icons/fa6";
import { BiSolidHome } from "react-icons/bi";
import { GiRoundShield } from "react-icons/gi";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate, useLocation } from 'react-router-dom';
function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  // const navItems = [
  //   { id: 1, name: 'Sportsbook', icon: 'sportsbook' },
  //   { id: 2, name: 'In-play', icon: 'inplay' },
  //   { id: 3, name: 'Home', icon: 'home' },
  //   { id: 4, name: 'Casino', icon: 'casino' },
  //   { id: 5, name: 'Preferences', icon: 'preferences' },
  // ]

  // const getIcon = (icon) => {
  //   switch(icon) {
  //     case 'sportsbook': return '⚽'
  //     case 'inplay': return '📡'
  //     case 'home': return '🏠'
  //     case 'casino': return '🎰'
  //     case 'preferences': return '👤'
  //     default: return '•'
  //   }
  // }
  const navItems = [
    { id: 1, name: 'Sportsbook', icon: <BiSolidCricketBall />, path: "" },
    { id: 2, name: 'In-play', icon: <FaRegCirclePlay />, path: "/inplay" },
    { id: 3, name: 'Home', icon: <BiSolidHome />, path: "/" },
    { id: 4, name: 'Casino', icon: <GiRoundShield />, path: "/casino" },
    { id: 5, name: 'Preferences', icon: <MdAccountCircle />, path: "" },
  ]

  const [activetab, setactivetab] = useState("Home");

  useEffect(() => {
    // Update active tab based on current location
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.path === currentPath || (currentPath === "/home" && item.name === "Home"));
    if (currentItem) {
      setactivetab(currentItem.name);
    }
  }, [location.pathname]);

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-[#212e44] rounded-t-2xl lg:hidden z-40'>
      <div className='flex justify-around items-center h-16 px-2'>
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path || (location.pathname === "/home" && item.name === "Home" && item.path === "/");
          return (
          <button
            key={item.id}
            className={`
              flex-1 flex flex-col items-center justify-center py-2 
              transition hover:bg-gray-800 rounded
              ${isActive ? 'text-[#01fafe] bg-[#071123] border-t-4 border-t-[#01fafe]' : 'text-[#ffffff]'}
            `}
            onClick={() =>{
              if (item.path) {
                setactivetab(item.name);
                navigate(item.path);
              }
            } }
          >
            {/* <span className='text-xl mb-1'>{getIcon(item.icon)}</span> */}
            <span className='text-xl mb-1'>{item.icon}</span>
            <span className='text-xs'>{item.name}</span>
          </button>
          );
        })}
      </div>
    </nav>
  )
}

export default BottomNav
