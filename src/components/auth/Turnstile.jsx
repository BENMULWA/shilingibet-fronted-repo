import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const SITE_KEY = isLocalhost
  ? "1x00000000000000000000AA"
  : "0x4AAAAAACNGJeFXzN3t7n2k";

const Turnstile = forwardRef(function Turnstile(
  { onVerify, onError, onExpire },
  ref,
) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const isReadyRef = useRef(false);
  const pendingExecuteRef = useRef(null);

  // Store callbacks in refs to avoid dependency issues
  const onVerifyRef = useRef(onVerify);
  const onErrorRef = useRef(onError);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onErrorRef.current = onError;
    onExpireRef.current = onExpire;
  }, [onVerify, onError, onExpire]);

  // Expose execute and reset methods to parent components
  useImperativeHandle(ref, () => ({
    execute: () => {
      if (isReadyRef.current && widgetIdRef.current && window.turnstile) {
        window.turnstile.execute(widgetIdRef.current);
      } else {
        // Widget not ready yet, queue the execute
        pendingExecuteRef.current = true;
      }
    },
    reset: () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
    isReady: () => isReadyRef.current,
  }));

  useEffect(() => {
    let interval = null;
    let mounted = true;

    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) {
        return;
      }

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          callback: (token) => {
            onVerifyRef.current?.(token);
          },
          "error-callback": (error) => {
            console.error("Turnstile error:", error);
            onErrorRef.current?.(error);
          },
          "expired-callback": () => {
            onExpireRef.current?.();
          },
        });

        isReadyRef.current = true;

        // Execute if there was a pending request
        if (pendingExecuteRef.current && widgetIdRef.current) {
          pendingExecuteRef.current = false;
          window.turnstile.execute(widgetIdRef.current);
        }
      } catch (error) {
        console.error("Failed to render Turnstile:", error);
        onErrorRef.current?.(error);
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      // Wait for Turnstile script to load
      interval = setInterval(() => {
        if (window.turnstile && mounted) {
          clearInterval(interval);
          interval = null;
          renderWidget();
        }
      }, 100);
    }

    return () => {
      mounted = false;
      if (interval) {
        clearInterval(interval);
      }
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore cleanup errors
        }
        widgetIdRef.current = null;
        isReadyRef.current = false;
      }
    };
  }, []);

  return <div ref={containerRef} />;
});

export default Turnstile;
