import React, { useEffect, useRef, useState } from 'react';
import '../css/beginning.css';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [text, setText] = useState('it has already begun.');
  const [userInput, setUserInput] = useState('');
  const [isError, setIsError] = useState(false);
  const [isJumpScare, setIsJumpScare] = useState(false);
  const [isRedGlitch, setIsRedGlitch] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasClickedText, setHasClickedText] = useState(false);
  const [unsettlingAudioPlaying, setUnsettlingAudioPlaying] = useState(false); // Track if unsettling audio is playing

  const glitchSound = useRef(null);
  const unsettling1 = useRef(null);
  const unsettling2 = useRef(null);
  const jumpscareSound = useRef(null);
  const navigate = useNavigate();

  const texts = [
    "it has already begun.",
    "your journey has ended.",
    "do you remember?",
    "walk down the path laid before you",
    "grace the graves that hold you",
    "who am i?",
    "who are you?"
  ];

  useEffect(() => {
    glitchSound.current = new Audio(process.env.PUBLIC_URL + '/sounds/subtle-glitch.wav');
    glitchSound.current.preload = "auto";
    glitchSound.current.playbackRate = 1.55;

    unsettling1.current = new Audio(process.env.PUBLIC_URL + '/sounds/unsettling-1.mp3');
    unsettling2.current = new Audio(process.env.PUBLIC_URL + '/sounds/unsettling-2.mp3');

    unsettling1.current.loop = true;
    unsettling2.current.loop = true;

    jumpscareSound.current = new Audio(process.env.PUBLIC_URL + '/sounds/jumpscare.mp3');
    jumpscareSound.current.preload = "auto";

    const onCanPlayThrough = () => {
      // No initial play here
    };

    unsettling1.current.addEventListener('canplaythrough', onCanPlayThrough);
    unsettling2.current.addEventListener('canplaythrough', onCanPlayThrough);

    return () => {
      unsettling1.current?.removeEventListener('canplaythrough', onCanPlayThrough);
      unsettling2.current?.removeEventListener('canplaythrough', onCanPlayThrough);
      unsettling1.current?.pause();
      unsettling2.current?.pause();
    };
  }, []);

  useEffect(() => {
    // Reset interaction states on component mount
    setHasInteracted(false);
    setHasClickedText(false);
    setUnsettlingAudioPlaying(false); // Ensure unsettling audio is not playing initially
    setIsRedGlitch(false); // Reset red glitch state on mount
    setText('it has already begun.'); // Also reset the text
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    const unlock = () => {
      setHasInteracted(true);
      glitchSound.current?.play().then(() => {
        glitchSound.current.pause();
        glitchSound.current.currentTime = 0;
      }).catch(() => {});
      window.removeEventListener('mousemove', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('mousemove', unlock);
    window.addEventListener('keydown', unlock);
    window.addEventListener('touchstart', unlock);

    return () => {
      window.removeEventListener('mousemove', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  useEffect(() => {
    if (!hasInteracted || !hasClickedText || isRedGlitch) return;

    let isMounted = true;

    const glitchLoop = () => {
      const delay = Math.random() * 5000 + 2000;

      setTimeout(() => {
        if (!isMounted || isRedGlitch) return;

        setIsGlitching(true);
        glitchSound.current.currentTime = 0;
        glitchSound.current.play().catch(() => {});

        setTimeout(() => {
          if (!isMounted || isRedGlitch) return;
          setIsGlitching(false);

          setText(prev => {
            const i = texts.indexOf(prev);
            return i < texts.length - 1 ? texts[i + 1] : "who are you?";
          });

          glitchLoop();
        }, 300);
      }, delay);
    };

    glitchLoop();
    return () => { isMounted = false; };
  }, [hasInteracted, hasClickedText, isRedGlitch]);

  useEffect(() => {
    if (text !== "who are you?") return;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        const guess = userInput.trim().toLowerCase();
        switch (guess) {
          case 'madame red':
            navigate('/runes');
            break;
          case 'xerxes':
            navigate('/contract'); 
            break;
          case 'senshi':
            navigate('/meal'); 
            break;
          case 'daenerys':
            navigate('/patron'); 
            break;
          case 'daeron':
            navigate('/god'); 
            break;
          case 'cho':
            navigate('/traitor'); 
            break;
          case 'xian':
            navigate('/deliverer'); 
            break;
          case 'rekurth':
            navigate('/anchor'); 
            break;
          case 'dell':
            navigate('/wildcard'); 
            break;
          case 'mikay':
            navigate('/deal'); 
            break;
          case 'sia':
            navigate('/missing'); 
            break;
          default:
            setIsError(true);
            setText("that is not who you are who are YOU?");
            setIsJumpScare(true);
            setIsRedGlitch(true); // Set red glitch state

            // Start unsettling sounds if not already playing
            if (!unsettlingAudioPlaying) {
              unsettling1.current?.play().catch(err => console.error("Error playing unsettling-1", err));
              unsettling2.current?.play().catch(err => console.error("Error playing unsettling-2", err));
              setUnsettlingAudioPlaying(true);
            }

            if (jumpscareSound.current) {
              jumpscareSound.current.currentTime = 0;
            }
            jumpscareSound.current?.play().catch(err => console.error("Error playing jumpscare", err));

            setTimeout(() => {
              setText("who are you?");
              setIsError(false);
              setIsJumpScare(false);
              // DO NOT reset isRedGlitch here
            }, 3000);
            break;
        }
        setUserInput('');
      } else if (e.key === 'Backspace') {
        setUserInput(prev => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        setUserInput(prev => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [text, userInput, navigate, unsettlingAudioPlaying]);

  const textClass = [
    isGlitching && 'glitch-text',
    isJumpScare && 'jump-scare',
    isRedGlitch && 'error-glitch',
    !hasClickedText && 'click-to-start',
    !hasClickedText && 'hover-glitch'
  ].filter(Boolean).join(' ');

  return (
    <div className={`ominous-container ${isError ? 'error-flash' : ''}`}>
      <div className={textClass} onClick={() => setHasClickedText(true)}>
        {text}
      </div>

      {text === "who are you?" && (
        <input
          type="text"
          value={userInput}
          onChange={() => {}}
          style={{ visibility: 'hidden' }}
          autoFocus
        />
      )}
    </div>
  );
}

export default Landing;