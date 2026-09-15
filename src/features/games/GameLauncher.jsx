import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Loader from "../../components/Loader";
import { useGameSession } from "../../hooks/useGames";

export default function GameLauncher({ game, gameUuid, title }) {
  const { launchGameAsync, isLoading } = useGameSession();
  const queryClient = useQueryClient();
  const [launchUrl, setLaunchUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const iframeRef = useRef(null);
  const launchedGameRef = useRef(null);
  const relaunchingRef = useRef(false);
  const lastRelaunchAtRef = useRef(0);
  const launchGenerationRef = useRef(0);
  const inFlightLaunchRef = useRef(null);

  const requestLaunch = useCallback((reconnecting = false) => {
    const now = Date.now();
    if (inFlightLaunchRef.current) return inFlightLaunchRef.current;
    if (reconnecting && now - lastRelaunchAtRef.current < 10_000) return null;

    relaunchingRef.current = true;
    if (reconnecting) lastRelaunchAtRef.current = now;
    const generation = ++launchGenerationRef.current;
    setError(null);
    setIsReconnecting(reconnecting);

    const launchPromise = launchGameAsync({ game, game_uuid: gameUuid })
      .then((response) => {
          if (generation !== launchGenerationRef.current) return;
          // Changing the URL and iframe key guarantees the old provider
          // document and its short-lived token are discarded.
          setLaunchUrl(response.launchUrl);
          relaunchingRef.current = false;
          setIsReconnecting(false);
          queryClient.invalidateQueries({ queryKey: ["user-balance"] });
      })
      .catch((launchError) => {
          if (generation !== launchGenerationRef.current) return;
          const message = launchError?.message || `Unable to launch ${title}`;
          setError(message);
          relaunchingRef.current = false;
          setIsReconnecting(false);
          toast.error(message);
      })
      .finally(() => {
        if (inFlightLaunchRef.current === launchPromise) {
          inFlightLaunchRef.current = null;
        }
      });

    inFlightLaunchRef.current = launchPromise;
    return launchPromise;
  }, [game, gameUuid, launchGameAsync, queryClient, title]);

  useEffect(() => {
    const gameKey = gameUuid || game;
    // Guards React StrictMode's repeated effect setup from creating two
    // sessions and invalidating the URL that wins the render race.
    if (!gameKey || launchedGameRef.current === gameKey) return;
    launchedGameRef.current = gameKey;
    setLaunchUrl(null);
    requestLaunch(false);
  }, [game, gameUuid, requestLaunch]);

  useEffect(() => {
    const handleProviderMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;

      let message = event.data;
      if (typeof message !== "string") {
        try {
          message = JSON.stringify(message);
        } catch {
          return;
        }
      }

      if (/player[\s_-]*token.*expir|token.*expir|session.*expir/i.test(message)) {
        requestLaunch(true);
      }
    };

    window.addEventListener("message", handleProviderMessage);
    return () => window.removeEventListener("message", handleProviderMessage);
  }, [requestLaunch]);

  if ((isLoading && !launchUrl) || isReconnecting) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader size={62} iconClass="text-primary" />
        <p className="text-sm text-white/75">
          {isReconnecting ? "Reconnecting game session..." : "Starting game..."}
        </p>
      </div>
    );
  }

  if (error || !launchUrl) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-400">{error || `${title} is unavailable`}</p>
        <button
          type="button"
          onClick={() => requestLaunch(true)}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-black"
        >
          Reconnect game
        </button>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      key={launchUrl}
      src={launchUrl}
      title={title}
      allow="fullscreen; autoplay"
      allowFullScreen
      onError={() => requestLaunch(true)}
      className="block h-[calc(100dvh-134px)] w-full rounded-none border-0 md:h-[calc(100dvh-64px)] md:rounded-[4px]"
    />
  );
}
