import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import BottomNav from "../components/navigation/BottomNav";
import WhatsAppFloat from "../components/home/WhatsAppFloat";
import RulesModal from "../components/footer/RulesModal";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const location = useLocation();
  const isLaunchGame = location.pathname.startsWith("/launch-game/");

  return (
    <div className="h-screen icon-bg-colour flex flex-col lg:flex lg:flex-row overflow-hidden">
      {/* Sidebar - Hidden on mobile, visible on lg+ */}
      <div className="hidden lg:flex w-[225px] h-screen bg-gray-950 border-r border-gray-800 overflow-y-auto flex-shrink-0">
        <Sidebar setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bottom-16 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar - stops above BottomNav (h-16 = 64px) */}
      <div
        className={`
        fixed top-0 left-0 bottom-0 w-50 bg-gray-950 border-r border-gray-800 
        transform transition-transform duration-300 z-50 lg:hidden
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <Sidebar setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Main Content Area */}
        <main
          id="main-content-scroll"
          className={`flex-1 min-w-0 overflow-y-auto overflow-x-hidden ${isLaunchGame ? "pb-0" : "pb-28 lg:pb-0"}`}
        >
          <Outlet />
        </main>

        {/* Footer - desktop only (mobile uses fixed footer above BottomNav) */}
        {!isLaunchGame && (
          <footer
            className="hidden lg:block w-full cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
            style={{ backgroundColor: "#008c95" }}
            onClick={() => setRulesModalOpen(true)}
          >
            <div
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#ffffff",
                textTransform: "uppercase",
                fontFamily: "Lato",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "2px",
              }}
            >
              <span>RULES &amp; REGULATIONS © 2024</span>
            </div>
          </footer>
        )}
      </div>

      {/* WhatsApp floating button - Mobile only on Home & In-play */}
      <WhatsAppFloat />

      {/* Bottom Navigation - Mobile only; hidden on Launch Game page */}
      {!isLaunchGame && <BottomNav />}

      {/* Mobile footer above BottomNav — fixed so it's always visible on mobile */}
      {!isLaunchGame && (
        <div
          className="lg:hidden fixed bottom-16 left-0 right-0 z-30 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#008c95" }}
          onClick={() => setRulesModalOpen(true)}
        >
          <div
            style={{
              padding: "7px 10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#ffffff",
              textTransform: "uppercase",
              fontFamily: "Lato",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "2px",
            }}
          >
            <span>RULES &amp; REGULATIONS © 2024</span>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      <RulesModal
        open={rulesModalOpen}
        onClose={() => setRulesModalOpen(false)}
      />
    </div>
  );
}

export default MainLayout;
