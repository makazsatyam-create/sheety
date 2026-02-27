import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { startCasinoGame } from "../../services/casinoService";
import { getUser } from "../../redux/reducer/authReducer";
import { wsService } from "../../services/WebsocketService";
import EvolutionData from "../../data/Evolution.json";
import SpribeData from "../../data/spribe.json";
import JiliDataRaw from "../../data/jili.json";
import InoutData from "../../data/inout.json";
import EzugiData from "../../data/EZUGI.json";
import SabaData from "../../data/saba.json";
import LuckyData from "../../data/lucky.json";
import BtiData from "../../data/bti.json";
import CQ9Data from "../../data/CQ9.json";
import PGData from "../../data/pg.json";
import SmartsoftData from "../../data/smartsoft.json";
import JDBData from "../../data/jdb.json";
import GalaxsysDataRaw from "../../data/galaxsys.json";
const GalaxsysData = Array.isArray(GalaxsysDataRaw) ? GalaxsysDataRaw : [];
const JiliData = Array.isArray(JiliDataRaw?.[0])
  ? JiliDataRaw.flat()
  : JiliDataRaw || [];

function LaunchGame() {
  const dispatch = useDispatch();

  const { userInfo, loading: authLoading } = useSelector((state) => state.auth);
  const userId = userInfo?._id ?? userInfo?.id;
  const { gameuid } = useParams();
  const [searchParams] = useSearchParams();
  const gameTypeFromQuery = searchParams.get("gameType") || "";
  const [gameUrl, setGameUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iframeHeight, setIframeHeight] = useState("100vh");

  // Use ref to track if game has been launched to prevent re-launching on auth updates
  const hasLaunchedRef = useRef(false);
  const isInitializingRef = useRef(false);

  useEffect(() => {
    if (userId) {
      wsService.connect(dispatch, userId);
    }
  }, [dispatch, userId]);

  // Handle responsive iframe height
  useEffect(() => {
    const updateIframeHeight = () => {
      // On mobile, we want to account for browser chrome (address bar, etc.)
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      setIframeHeight(`calc(var(--vh, 1vh) * 100)`);
    };

    updateIframeHeight();
    window.addEventListener("resize", updateIframeHeight);
    window.addEventListener("orientationchange", updateIframeHeight);

    return () => {
      window.removeEventListener("resize", updateIframeHeight);
      window.removeEventListener("orientationchange", updateIframeHeight);
    };
  }, []);

  useEffect(() => {
    const launchGame = async () => {
      // Prevent re-launching if game is already running
      if (hasLaunchedRef.current || gameUrl) {
        return;
      }

      // Prevent concurrent launches
      if (isInitializingRef.current) {
        return;
      }

      // Wait for auth to finish loading (only on initial load)
      if (authLoading && !hasLaunchedRef.current) {
        return;
      }

      // If userInfo exists but doesn't have userName, fetch full user data (only once)
      if (userInfo && !userInfo.userName && !hasLaunchedRef.current) {
        try {
          isInitializingRef.current = true;
          await dispatch(getUser()).unwrap();
          isInitializingRef.current = false;
          // After getUser completes, the component will re-render with updated userInfo
          // and this effect will run again with the complete userInfo
          return;
        } catch (err) {
          isInitializingRef.current = false;
          setError("Failed to load user information");
          setLoading(false);
          return;
        }
      }

      // Check if userInfo exists and has required properties
      if (!userInfo || !userInfo.userName || !gameuid) {
        if (!hasLaunchedRef.current) {
          setError("User information or game ID is missing");
          setLoading(false);
        }
        return;
      }

      // Mark as initializing to prevent concurrent calls
      isInitializingRef.current = true;

      try {
        // Find the game from all provider JSON data (casino + sports: Saba, Lucky, BTI)
        const allGames = [
          ...(EvolutionData || []),
          ...(JiliData || []),
          ...(SpribeData || []),
          ...(InoutData || []),
          ...(EzugiData || []),
          ...(SabaData || []),
          ...(LuckyData || []),
          ...(BtiData || []),
          ...(CQ9Data || []),
          ...(PGData || []),
          ...(SmartsoftData || []),
          ...(JDBData || []),
          ...GalaxsysData,
        ];
        const uid = (gameuid || "").trim();
        const game = allGames.find(
          (g) => (g.game_uid || "").toString().trim() === uid
        );

        if (!game && !uid) {
          setError("Game not found");
          setLoading(false);
          isInitializingRef.current = false;
          return;
        }

        const creditAmount = userInfo.avbalance || 0;
        const gameType = game
          ? game.game_type || gameTypeFromQuery || ""
          : gameTypeFromQuery || "";

        const response = await startCasinoGame(
          userInfo.userName,
          gameuid,
          creditAmount,
          gameType
        );

        if (response && response.success && response.gameUrl) {
          setGameUrl(response.gameUrl);
          hasLaunchedRef.current = true; // Mark as launched
          // window.location.href = response.gameUrl;
        } else {
          setError(response?.message || "Failed to launch game");
        }
      } catch (err) {
        console.error("Error launching game:", err);
        setError(
          err.response?.data?.message ||
            "Failed to launch game. Please try again."
        );
      } finally {
        setLoading(false);
        isInitializingRef.current = false;
      }
    };

    launchGame();
  }, [userInfo, gameuid, dispatch]); // Removed authLoading from dependencies

  // Add viewport meta tag if not already present
  useEffect(() => {
    // Check if viewport meta tag exists
    let viewportMeta = document.querySelector('meta[name="viewport"]');

    if (!viewportMeta) {
      viewportMeta = document.createElement("meta");
      viewportMeta.name = "viewport";
      document.head.appendChild(viewportMeta);
    }

    // Set proper viewport for mobile gaming
    viewportMeta.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";

    // Add styles to prevent body scrolling
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-red-50 p-6 rounded-lg">
          <p className="text-red-600 text-lg font-semibold mb-2">Error</p>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!gameUrl) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg">No game URL available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="game-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#000", // Optional: black background for letterboxing
      }}
    >
      <iframe
        src={gameUrl}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          // For games that might not be responsive, you can use object-fit
          // objectFit: 'contain', // This will letterbox the game if needed
          // objectFit: 'cover',   // This will crop the game if needed
        }}
        title="Casino Game"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-top-navigation"
      />
    </div>
  );
}

export default LaunchGame;
