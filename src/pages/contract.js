import React, { useState } from 'react';
import { useTypeWriter } from '../utils/typeeff.js';
import '../css/contract.css';

function Contract() {
  const [textIndex, setTextIndex] = useState(0);

  const textLines = [
    'hello, xerxes',
    'our berserker',
    'goodbye, xerxes',
    'you deserter'
  ];

  const displayText = useTypeWriter(
    textLines[textIndex],
    100,
    () => {
      setTimeout(() => {
        setTextIndex(prev => (prev + 1) % textLines.length);
      }, 1000); // wait 1s
    }
  );

  return (
    <div className="contract-bg">
      <div className="contract-container">
        <div className="contract-text">
          {displayText}
        </div>
      </div>
    </div>
  );
}

export default Contract;
