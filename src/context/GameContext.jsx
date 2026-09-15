import { createContext, useContext, useEffect } from "react";

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  // Provider launch URLs are short-lived credentials. Never persist or restore
  // them; GameLauncher requests a fresh URL whenever a game is entered.
  const resetGame = () => {
    localStorage.removeItem("launchURL");
    sessionStorage.removeItem("launchURL");
  };

  // Remove values written by older frontend versions.
  useEffect(() => {
    localStorage.removeItem("launchURL");
    sessionStorage.removeItem("launchURL");
  }, []);

  return (
    <GameContext.Provider value={{ resetGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return ctx;
};
