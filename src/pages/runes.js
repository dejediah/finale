import React, { useState, useEffect, useRef } from 'react';
import '../css/runes.css';

function Runes() {
  const possibleLinks = [
    { text: "The Moon, The Sun, The Stars ", url: "/the1sky" },
    { text: "Temperance, Justice, Death", url: "/the6fates" },
    { text: "The Hermit, The Lovers, The Hierophant", url: "/the8stories" },
    { text: "The Chariot, Strength, The Fool", url: "the0king" },
  ];

  // State for link content and position (Runs once)
  const [chosenLink, setChosenLink] = useState({ text: '', url: '#' });
  const [positionStyle, setPositionStyle] = useState({});
  
  // State to trigger the single blink animation
  const [shouldBlink, setShouldBlink] = useState(false); 
  
  // Ref to hold the timer ID for the main clue delay
  const clueTimerRef = useRef(null); 

  // The time in milliseconds for the link to start blinking (5 seconds)
  const CLUE_DELAY_MS = 5000; 

  // --- Core Logic: Initialization and Clue Timer ---
  useEffect(() => {
    // 1. Initial link setup (Runs once on mount)
    const randomIndex = Math.floor(Math.random() * possibleLinks.length);
    setChosenLink(possibleLinks[randomIndex]);
    const randomTop = Math.floor(Math.random() * 90) + 5;
    const randomLeft = Math.floor(Math.random() * 90) + 5;
    setPositionStyle({
      position: 'absolute',
      top: `${randomTop}%`,
      left: `${randomLeft}%`,
      transform: 'translate(-50%, -50%)'
    });
    
    // 2. Start the main clue timer
    startClueTimer();

    // 3. Cleanup function: clear the timer when the component unmounts
    return () => {
        if (clueTimerRef.current) {
            clearTimeout(clueTimerRef.current);
        }
    };
  }, []); 
  
  // --- Timer Management Functions ---

  const startClueTimer = () => {
    // Clear any existing timer first
    if (clueTimerRef.current) {
        clearTimeout(clueTimerRef.current);
    }
    
    // Set the new timer
    clueTimerRef.current = setTimeout(() => {
        // After 10 seconds, trigger the blink
        triggerSingleBlink(); 
    }, CLUE_DELAY_MS);
  };
  
  const triggerSingleBlink = () => {
    setShouldBlink(true);
    
    // Start a short timer to turn off the blink class after the CSS animation completes
    // Your CSS animation is 0.5s, so we use 550ms.
    setTimeout(() => {
        setShouldBlink(false);
    }, 550);
  };

  // --- Event Handlers ---
  
  const handleMouseEnter = () => {
    // When found/hovered, clear the pending clue timer
    if (clueTimerRef.current) {
      clearTimeout(clueTimerRef.current);
    }
    // Also, make sure to immediately stop any single blink that might be active
    setShouldBlink(false);
  };

  const handleMouseLeave = () => {
    // When the mouse leaves, restart the long 10-second timer
    startClueTimer();
  };

  return (
    <div className="runes-container">
      <div className="runes-text">
        ᚱᚢᚾᛖᛋ ᚺᛖᛚᛚ ᛁᛋ ᚲᛟᛗᛁᛝ
      </div>
      
      <a 
        href={chosenLink.url} 
        // Dynamically add the 'blinking' class when the state is true
        className={`random-link ${shouldBlink ? 'blinking' : ''}`}
        style={positionStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        // Note: We no longer need onAnimationEnd because we are using a fixed timeout (550ms)
        // to end the single blink, which is simpler for this use case.
      >
        {chosenLink.text}
      </a>
    </div>
  );
}

export default Runes;