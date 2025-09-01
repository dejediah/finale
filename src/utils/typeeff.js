import { useState, useEffect, useRef } from 'react';

function useTypeWriter(text, speed = 50, onComplete) {
  const [displayText, setDisplayText] = useState('');
  const iRef = useRef(0);
  const timeoutRef = useRef();
  const onCompleteRef = useRef(onComplete);

  // keep latest callback without retriggering effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    iRef.current = 0;
    setDisplayText(text.charAt(iRef.current));

    function type() {
      if (iRef.current < text.length) {
        setDisplayText(prev => prev + text.charAt(iRef.current));
        iRef.current++;
        timeoutRef.current = setTimeout(type, speed);
      } else {
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }

    if (text.length > 0) type();

    return () => clearTimeout(timeoutRef.current);
  }, [text, speed]);

  return displayText;
}

export { useTypeWriter };