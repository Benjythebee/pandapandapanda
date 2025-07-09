import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import type { PhysicsItem } from './types';
import { pandaImages } from './panda';
import React from 'react';
import { PandaList } from './PandaList';



const preloadImages = ()=>{
    Object.values(pandaImages).forEach((src) => {
        const img = new window.Image();
        img.src = src;
    });
}
const items = new Map<string, PhysicsItem>();
const clock = {
  frame: 0,
}
// Main physics container component
const App: React.FC = () => {
  const [,setFrameId] = useState<number>(clock.frame);
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const animationRef = useRef<number|null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  const playSound = () => {
    const audio = new Audio('/panda.wav');
    audio.volume = 0.5; // Set volume to 50%
    audio.play();
  };

  // Physics constants
  const GRAVITY = 0.5;
  const BOUNCE_DAMPING = 0.7;
  const FRICTION = 0.95;

  // Update physics simulation
  const updatePhysics = useCallback((deltaTime: number) => {
    items.forEach((item) => {
        const newItem = { ...item };
        
        // Apply gravity
        newItem.velocity.y += GRAVITY * deltaTime;
        
        // Apply friction to horizontal movement
        newItem.velocity.x *= FRICTION;
        
        // Update position based on velocity
        newItem.position.x += newItem.velocity.x * deltaTime;
        newItem.position.y += newItem.velocity.y * deltaTime;
        
        // Collision with bottom
        if (newItem.position.y + newItem.size >= containerSize.height) {
          newItem.position.y = containerSize.height - newItem.size;
          newItem.velocity.y = -newItem.velocity.y * BOUNCE_DAMPING;
          
          // Stop tiny bounces
          if (Math.abs(newItem.velocity.y) < 1) {
            newItem.velocity.y = 0;
          }
        }
        
        // Collision with sides
        if (newItem.position.x <= 0) {
          newItem.position.x = 0;
          newItem.velocity.x = -newItem.velocity.x * BOUNCE_DAMPING;
        } else if (newItem.position.x + newItem.size >= containerSize.width) {
          newItem.position.x = containerSize.width - newItem.size;
          newItem.velocity.x = -newItem.velocity.x * BOUNCE_DAMPING;
        }

        // set velocity to 3 decimal places
        newItem.velocity.x = Math.round(newItem.velocity.x * 1000) / 1000;
        newItem.velocity.y = Math.round(newItem.velocity.y * 1000) / 1000;
        
        // set position to 3 decimal places
        newItem.position.x = Math.round(newItem.position.x * 1000) / 1000;
        newItem.position.y = Math.round(newItem.position.y * 1000) / 1000;

        if(newItem.velocity.y < 0.01 && newItem.velocity.y > -0.01) {
          newItem.velocity.y = 0; // Stop tiny upward velocity
        }
        if(newItem.velocity.x < 0.01 && newItem.velocity.x > -0.01) {
          newItem.velocity.x = 0; // Stop tiny horizontal velocity
        }

        return newItem;
      })

  }, [containerSize]);

  // Animation loop
  const animate = useCallback(() => {
    const interval = 1000 / 60; // 60fps
    const currentTime = Date.now();
    const deltaTime = Math.min((currentTime - lastTimeRef.current) / interval, 2); // Cap delta time
    lastTimeRef.current = currentTime;
    clock.frame += 1;
    setFrameId(clock.frame);
    updatePhysics(deltaTime);

  }, [updatePhysics]);
  
  // Use setInterval for 60fps
  useEffect(() => {
    const intervalId = setInterval(animate, 1000 / 30);
    return () => clearInterval(intervalId);
  }, [animate]);



  // Handle window resize
  useEffect(() => {
    preloadImages();
    const handleResize = () => {
      setContainerSize({
        width: window.innerWidth - 40,
        height: window.innerHeight - 100,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Start animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Handle container click to add items
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newItem: PhysicsItem = {
      id: Math.random().toString(36).substr(2, 9),
      position: {
        x: e.clientX - rect.left - 15,
        y: e.clientY - rect.top - 15,
      },
      velocity: {
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 10,
      },
      size: 100 + Math.random() * 20,
      color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][
        Math.floor(Math.random() * 6)
      ],
    };
    playSound();

    if( items.size >= 20){
      setItemIds(prev => {
        const copy = [...prev];
        const i = copy.shift()
        items.delete(i!);
        return [...copy,newItem.id];
      });
    }else{
      setItemIds(prev => [...prev, newItem.id]);
    }
    items.set(newItem.id, newItem);

  };

        
  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-5">

      <div
        // onClick={handleContainerClick}
        onMouseUp={handleContainerClick}
        style={{
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
        }}
        className="relative border-2 cursor-pointer border-gray-300 bg-white rounded-lg cursor-crosshair overflow-hidden shadow-lg"
      >

        <PandaList itemIds={itemIds} items={items} />

      </div>

    </div>
  );
};


export default App