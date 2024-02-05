import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const angle = 20;

// const lerp = (start, end, amount) => {
//   return (1 - amount) * start + amount * end;
// };

const remap = (value, oldMax, newMax) => {
  const newValue = ((value + oldMax) * (newMax * 2)) / (oldMax * 2) - newMax;
  return Math.min(Math.max(newValue, -newMax), newMax);
};

const Card3D = ({ children, borderClasses, href }) => {
  const cardRef = useRef(null);

  const removeShadowInDarkMode = (card) => {
    card.style.setProperty('--blurOrNone', 'blur(2rem) saturate(0.9)');
    // isDarkMode && card.style.setProperty("--blurOrNone", "blur(20rem) saturate(0)");
  };

  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  useEffect(() => {
    const card = cardRef.current;

    const handleMouseMove = (event) => {
      const rect = card.getBoundingClientRect();
      const centerX =
        (rect.left + window.scrollX + (rect.right + window.scrollX)) / 2;
      const centerY =
        (rect.top + window.scrollY + (rect.bottom + window.scrollY)) / 2;

      const posX = event.pageX - centerX;
      const posY = event.pageY - centerY;

      const x = remap(posX, rect.width / 2, angle);
      const y = remap(posY, rect.height / 2, angle);

      setCurrentX(x);
      setCurrentY(y);
    };

    const handleMouseOut = (event) => {
      setCurrentX(0);
      setCurrentY(0);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseout', handleMouseOut);

    removeShadowInDarkMode(card);

    // const intervalId = setInterval(update, 1000 / 60);
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseout', handleMouseOut);
      //   clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const card = cardRef.current;

    const update = () => {
      card.style.setProperty('--rotateY', currentX + 'deg');
      card.style.setProperty('--rotateX', -currentY + 'deg');
    };

    update();
  }, [currentX, currentY]);

  useEffect(() => {
    const card = cardRef.current;
    removeShadowInDarkMode(card);
  }, []);

  return (
    <Link
      className={`card ${borderClasses ? borderClasses : ''}`}
      ref={cardRef}
      to={href}
      target='_blank'
      rel='noopener noreferrer'
    >
      {children}
    </Link>
  );
};

export default Card3D;
