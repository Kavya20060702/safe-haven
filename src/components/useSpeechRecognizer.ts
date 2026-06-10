import { useState, useEffect, useRef, useCallback } from "react";

interface SpeechRecognizerOptions {
  onResult: (transcript: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  lang?: string;
}

export function useSpeechRecognizer({
  onResult,
  onStart,
  onEnd,
  onError,
  lang = "en-IN",
}: SpeechRecognizerOptions) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  
  const activeRecognizerRef = useRef<any>(null);
  const isResultProcessedRef = useRef<boolean>(false);

  // Keep references to all callback handlers stable, ignoring option recreation on render
  const onResultRef = useRef(onResult);
  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);

  // Run on every render to ensure callbacks are always pointing to the absolute latest closures
  useEffect(() => {
    onResultRef.current = onResult;
    onStartRef.current = onStart;
    onEndRef.current = onEnd;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      setSupported(true);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (activeRecognizerRef.current) {
      try {
        activeRecognizerRef.current.abort();
      } catch (err) {
        console.error("Error aborting speech recognition:", err);
      }
      activeRecognizerRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      if (onErrorRef.current) {
        onErrorRef.current(new Error("Speech recognition not supported in this browser."));
      }
      return;
    }

    // Stop and abort any ongoing recognition session before beginning a new one
    if (activeRecognizerRef.current) {
      try {
        activeRecognizerRef.current.abort();
      } catch (e) {}
    }

    // Reset result tracking for the new speech cycle
    isResultProcessedRef.current = false;

    try {
      const recognizer = new SpeechRec();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = lang;

      // Keep reference of current active session
      activeRecognizerRef.current = recognizer;

      recognizer.onstart = () => {
        // Guard against events from stale/aborted instances
        if (activeRecognizerRef.current !== recognizer) return;
        
        setIsListening(true);
        if (onStartRef.current) onStartRef.current();
      };

      recognizer.onerror = (event: any) => {
        // Guard against events from stale/aborted instances
        if (activeRecognizerRef.current !== recognizer) return;
        
        setIsListening(false);
        if (onErrorRef.current) onErrorRef.current(event);
      };

      recognizer.onend = () => {
        // Guard against events from stale/aborted instances
        if (activeRecognizerRef.current !== recognizer) return;
        
        setIsListening(false);
        if (onEndRef.current) onEndRef.current();
      };

      recognizer.onresult = (event: any) => {
        // Guard against events from stale/aborted instances
        if (activeRecognizerRef.current !== recognizer) return;
        
        // Essential protection block to completely prevent multiple duplicates firing from the same voice trigger
        if (isResultProcessedRef.current) {
          return;
        }

        // We only want the completed (isFinal) audio translation text.
        // Ignore any intermediate/interim drafts.
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res && res.isFinal) {
            const alternativeText = res[0]?.transcript;
            if (alternativeText) {
              finalText += alternativeText;
            }
          }
        }

        if (finalText.trim()) {
          isResultProcessedRef.current = true;
          onResultRef.current(finalText.trim());
          
          // Proactively stop the recognizer session to prevent any supplementary/unneeded results
          try {
            recognizer.stop();
          } catch (e) {}
        }
      };

      recognizer.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setIsListening(false);
      if (onErrorRef.current) onErrorRef.current(err);
    }
  }, [lang]);

  // Clean up Web Speech recognition resources on component unmount
  useEffect(() => {
    return () => {
      if (activeRecognizerRef.current) {
        try {
          activeRecognizerRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    supported,
  };
}
