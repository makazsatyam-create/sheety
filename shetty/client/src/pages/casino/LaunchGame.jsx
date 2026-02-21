// import React, { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { useParams } from 'react-router-dom';
// import { startCasinoGame } from '../services/casinoService';
// import { getUser } from '../redux/reducer/authReducer';
// import EvolutionData from '../components/api_json/Evolution.json';
// import EzugiData from '../components/api_json/ezugi.json';
// import SpribeData from '../components/api_json/spribe.json';

// function LaunchGame() {
//   const dispatch = useDispatch();

//   const { userInfo, loading: authLoading } = useSelector((state) => state.auth);
//   const { gameuid } = useParams();
//   const [gameUrl, setGameUrl] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const launchGame = async () => {
//       // Wait for auth to finish loading
//       if (authLoading) {
//         return;
//       }

//       // If userInfo exists but doesn't have userName, fetch full user data
//       if (userInfo && !userInfo.userName) {
//         try {
//           await dispatch(getUser()).unwrap();
//           // After getUser completes, the component will re-render with updated userInfo
//           // and this effect will run again with the complete userInfo
//           return;
//         } catch (err) {
//           setError('Failed to load user information');
//           setLoading(false);
//           return;
//         }
//       }

//       // Check if userInfo exists and has required properties
//       if (!userInfo || !userInfo.userName || !gameuid) {
//         setError('User information or game ID is missing');
//         setLoading(false);
//         return;
//       }

//       try {
//         // Find the game from the JSON data to get full game info
//         const allGames = [...EvolutionData, ...EzugiData, ...SpribeData];
//         const game = allGames.find(g => g.game_uid === gameuid);

//         if (!game) {
//           setError('Game not found');
//           setLoading(false);
//           return;
//         }

//         // Use user's available balance as credit amount (or you can set a default)
//         const creditAmount = userInfo.avbalance || 0;

//         // Call the API to get the game URL
//         const response = await startCasinoGame(
//           userInfo.userName,
//           gameuid,
//           creditAmount
//         );

//         if (response && response.success && response.gameUrl) {
//           setGameUrl(response.gameUrl);
//           // window.location.href = response.gameUrl;
//         } else {
//           setError(response?.message || 'Failed to launch game');
//         }
//       } catch (err) {
//         console.error('Error launching game:', err);
//         setError(err.response?.data?.message || 'Failed to launch game. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     launchGame();
//   }, [userInfo, gameuid, authLoading, dispatch]);

//   if (loading) {
//     return (
//       <div className='flex items-center justify-center h-screen'>
//         <div className='text-center'>
//           <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
//           <p className='text-lg'>Loading game...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className='flex items-center justify-center h-screen'>
//         <div className='text-center bg-red-50 p-6 rounded-lg'>
//           <p className='text-red-600 text-lg font-semibold mb-2'>Error</p>
//           <p className='text-red-500'>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!gameUrl) {
//     return (
//       <div className='flex items-center justify-center h-screen'>
//         <div className='text-center'>
//           <p className='text-lg'>No game URL available</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className='w-full h-screen'>
//       <iframe
//         src={gameUrl}
//         className='w-full h-full border-0'
//         title='Casino Game'
//         allowFullScreen
//       />
//     </div>
//   );
// }

// export default LaunchGame

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
import PGData from "../../data/PG.json";
import SmartsoftData from "../../data/smartsoft.json";
import JDBData from "../../data/JDB.json";

const JiliData = Array.isArray(JiliDataRaw?.[0]) ? JiliDataRaw.flat() : JiliDataRaw || [];

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

  // Use ref to track if game has been launched to prevent re-launching on auth updates
  const hasLaunchedRef = useRef(false);
  const isInitializingRef = useRef(false);

  useEffect(() => {
    if (userId) {
      wsService.connect(dispatch, userId);
    }
  }, [dispatch, userId]);

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
        ];
        const game = allGames.find((g) => g.game_uid === gameuid);

        if (!game) {
          setError("Game not found");
          setLoading(false);
          isInitializingRef.current = false;
          return;
        }

        const creditAmount = userInfo.avbalance || 0;
        const gameType = game.game_type || gameTypeFromQuery || "";

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
    <div className="w-full h-screen">
      <iframe
        src={gameUrl}
        className="w-full h-full border-0"
        title="Casino Game"
        allowFullScreen
      />
    </div>
  );
}

export default LaunchGame;
