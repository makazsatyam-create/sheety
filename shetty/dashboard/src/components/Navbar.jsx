import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdArrowDropdown, IoMdClose, IoMdRefresh } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdmin,
  userLogout,
  changePasswordBySubAdmin,
} from "../redux/reducer/authReducer";
import { toast } from "react-toastify";
import logo from "../assets/title.png";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, loading, isPasswordChanged } = useSelector(
    (state) => state.auth,
  );

  const [activeItem, setActiveItem] = useState("Home");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [dropdownRect, setDropdownRect] = useState(null);
  const hoverCloseTimeoutRef = useRef(null);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const shouldShowPasswordPopup = isPasswordChanged === false;

  const [changeFormData, setChangeFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (hoverCloseTimeoutRef.current) clearTimeout(hoverCloseTimeoutRef.current);
    };
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/home" },
    {
      name: "Downline List",
      submenu: [
        { name: "User Downline List", path: "/user-download-list" },
        {
          name: "Agent Downline List",
          path: "/agent-download-list",
          reload: true,
        },
      ],
    },
    { name: "My account", path: "/my-account" },
    { name: "Security", path: "/secureauth" },
    {
      name: "My Report",
      submenu: [
        { name: "Event Profit/Loss", path: "/eventpl" },
        { name: "Downline Profit/Loss", path: "/downpl" },
      ],
    },
    { name: "BetList", path: "/betlist" },
    { name: "Market Analysis", path: "/my-market" },
    {
      name: "Banking",
      submenu: [
        { name: "User Banking", path: "/banking" },
        { name: "Master Banking", path: "/master-banking" },
      ],
    },
    { name: "Add Account", path: "/add-account" },
    { name: "Password History", path: "/password-history" },
    { name: "Restore User", path: "/restore-user" },
    ...(userInfo?.role === "supperadmin"
      ? [
          {
            name: "Self Deposit/Withdraw",
            submenu: [
              { name: "Self Deposit", path: "/self-deposit" },
              { name: "Self Withdraw", path: "/self-withdraw" },
            ],
          },
          {
            name: "Manual Control",
            submenu: [
              { name: "Match Control", path: "/match-control" },
              { name: "Result Control", path: "/result-control" },
            ],
          },
        ]
      : []),
    { name: "Logout", isLogout: true },
  ];

  const logout = async () => {
    try {
      const data = await dispatch(userLogout()).unwrap();
      localStorage.removeItem("auth");
      toast.success(data.message);
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500);
    } catch (error) {
      toast.error(error);
    }
  };

  const reload = () => dispatch(getAdmin());

  const toggleMobileSubmenu = (itemName, event) => {
    if (mobileSubmenuOpen === itemName) {
      setMobileSubmenuOpen(null);
    } else {
      const rect = event.target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 200;

      if (rect.bottom + dropdownHeight > viewportHeight) {
        setDropdownPosition({
          top: rect.top - dropdownHeight,
          left: rect.left,
          position: "fixed",
        });
      } else {
        setDropdownPosition({
          top: rect.bottom,
          left: rect.left,
          position: "fixed",
        });
      }
      setMobileSubmenuOpen(itemName);
    }
  };

  const isSubmenuActive = (item) => {
    if (!item.submenu) return false;
    return item.submenu.some((sub) => location.pathname === sub.path);
  };

  const changeSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        changePasswordBySubAdmin({
          oldPassword: changeFormData.oldPassword,
          newPassword: changeFormData.newPassword,
          confirmPassword: changeFormData.confirmPassword,
        }),
      );
      if (result.type.endsWith("/fulfilled")) {
        toast.success("Password changed successfully");
        setChangeFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else if (result.type.endsWith("/rejected")) {
        toast.error(result.payload || "Failed to change password");
      }
    } catch (error) {
      console.log("Password change error:", error);
    }
  };

  return (
    <>
      {/* Header - fixed at top, full width */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 w-full ${location.pathname === "/login" ? "hidden" : "block"}`}
      >
        {/* Desktop Header */}
        <header className="bg-color hidden border-b border-gray-800 lg:flex lg:h-14 lg:w-full lg:items-center lg:justify-between lg:px-4 xl:px-6">
          <img src={logo} alt="Winadda" className="h-10" />
          <div className="flex items-center gap-3">
            <p
              className="rounded-sm bg-[#292929] px-1.5 text-[10px] text-white uppercase"
              style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,.4)" }}
            >
              {userInfo?.role}
            </p>
            <p className="text-sm text-white">{userInfo?.name}</p>
            <div className="text-xs font-semibold text-white">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <p>INR ({userInfo?.avbalance ?? 0})</p>
              )}
            </div>
            <button
              onClick={reload}
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded bg-[#2a2a2a] text-white"
              style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,.4)" }}
            >
              <IoMdRefresh className="text-sm" />
            </button>
            <button
              onClick={logout}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-red-600 text-white"
            >
              <AiOutlineLogout className="text-lg" />
            </button>
          </div>
        </header>

        {/* Desktop Navigation - full width, horizontal scroll */}
        <nav className="bg-color2 hidden h-10 text-black xl:block xl:w-full">
          <ul className="nav-scroll flex h-full w-full flex-nowrap items-center overflow-x-auto overflow-y-hidden">
            {navItems.map((item, i) =>
              item.isLogout ? (
                <li
                  key={item.name}
                  className="relative flex h-full shrink-0 items-center"
                >
                  <button
                    type="button"
                    onClick={logout}
                    className="flex h-full items-center gap-1.5 border-r border-gray-500 px-3 text-[13px] font-semibold whitespace-nowrap text-black transition-colors hover:opacity-90"
                  >
                    {item.name} <MdLogout className="shrink-0" />
                  </button>
                </li>
              ) : (
                <li
                  key={i}
                  className="relative flex h-full shrink-0 items-center"
                  onMouseEnter={(e) => {
                    if (hoverCloseTimeoutRef.current) {
                      clearTimeout(hoverCloseTimeoutRef.current);
                      hoverCloseTimeoutRef.current = null;
                    }
                    setHoveredItem(item.name);
                    if (item.submenu) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setDropdownRect({ top: rect.bottom, left: rect.left, width: rect.width });
                    }
                  }}
                  onMouseLeave={() => {
                    hoverCloseTimeoutRef.current = setTimeout(() => {
                      setHoveredItem(null);
                      setDropdownRect(null);
                      hoverCloseTimeoutRef.current = null;
                    }, 150);
                  }}
                >
                  {item.path ? (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex h-full items-center border-r border-gray-500 px-3 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                          isActive ? "bg-color text-white" : "text-black"
                        }`
                      }
                      onClick={() => setActiveItem(item.name)}
                    >
                      {item.name}
                    </NavLink>
                  ) : (
                    <span
                      className={`flex h-full cursor-pointer items-center gap-[10px] border-r border-gray-500 px-3 text-[13px] font-semibold whitespace-nowrap ${
                        isSubmenuActive(item)
                          ? "bg-color text-white"
                          : "text-black"
                      }`}
                    >
                      {item.name}
                      <IoMdArrowDropdown className="w-3" />
                    </span>
                  )}
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>

      {/* Desktop submenu dropdown - rendered in portal so it is not clipped by nav overflow */}
      {hoveredItem &&
        dropdownRect &&
        (() => {
          const item = navItems.find((n) => n.name === hoveredItem && n.submenu);
          if (!item?.submenu) return null;
          return createPortal(
            <div
              className="fixed z-[100] min-w-[160px] font-semibold whitespace-nowrap text-white shadow-lg"
              style={{
                top: dropdownRect.top,
                left: dropdownRect.left,
              }}
              onMouseEnter={() => {
                if (hoverCloseTimeoutRef.current) {
                  clearTimeout(hoverCloseTimeoutRef.current);
                  hoverCloseTimeoutRef.current = null;
                }
              }}
              onMouseLeave={() => {
                setHoveredItem(null);
                setDropdownRect(null);
              }}
            >
              <ul className="bg-color max-h-[70vh] overflow-y-auto border border-gray-700">
                {item.submenu
                  .filter(
                    (sub) =>
                      !(
                        userInfo?.role === "agent" &&
                        sub.name === "Agent Downline List"
                      ),
                  )
                  .map((sub, index) => (
                    <li
                      key={index}
                      className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700"
                    >
                      <NavLink
                        to={sub.path}
                        className="block px-3 py-2 text-[13px]"
                        onClick={(e) => {
                          setActiveItem(item.name);
                          setHoveredItem(null);
                          setDropdownRect(null);
                          if (sub.reload) {
                            e.preventDefault();
                            navigate(sub.path);
                            window.location.reload();
                          }
                        }}
                      >
                        {sub.name}
                      </NavLink>
                    </li>
                  ))}
              </ul>
            </div>,
            document.body,
          );
        })()}

      {/* Spacer so page content is not hidden under fixed header (header ~3.5rem + nav ~2.5rem) */}
      <div
        className={location.pathname === "/login" ? "hidden" : "block"}
        style={{ minHeight: "6rem" }}
      />

      {/* Password Popup */}
      {shouldShowPasswordPopup && (
        <div className="fixed z-50 flex h-full w-full items-center justify-center bg-black/30">
          <div className="fixed top-6 left-1/2 w-90 -translate-x-1/2 rounded-lg bg-white shadow-lg md:w-[500px]">
            <div className="flex items-center justify-between rounded-t-lg bg-gray-700 px-4 py-2 text-white">
              <h2 className="font-semibold">Change Password</h2>
            </div>
            <form className="space-y-4 p-6" onSubmit={changeSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Old Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showOld ? "text" : "password"}
                    placeholder="Old Password.."
                    value={changeFormData.oldPassword}
                    onChange={(e) =>
                      setChangeFormData({
                        ...changeFormData,
                        oldPassword: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded border px-3 py-2 focus:ring focus:ring-blue-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute top-9 right-3 text-gray-500"
                  >
                    {showOld ? "🙈" : "👁️"}
                  </button>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="New Password.."
                    value={changeFormData.newPassword}
                    onChange={(e) =>
                      setChangeFormData({
                        ...changeFormData,
                        newPassword: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded border px-3 py-2 focus:ring focus:ring-blue-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute top-9 right-3 text-gray-500"
                  >
                    {showNew ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password.."
                  value={changeFormData.confirmPassword}
                  onChange={(e) =>
                    setChangeFormData({
                      ...changeFormData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded border px-3 py-2 focus:ring focus:ring-blue-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute top-9 right-3 text-gray-500"
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
