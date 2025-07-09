import React from 'react';
import pandaDown from './assets/panda_down.webp';
import panda from './assets/panda.webp';
import pandaFall from './assets/panda_fall.webp';
import type { PhysicsItem } from './types';

type PandaState = 'falling' | 'standing' | 'down';


// eslint-disable-next-line react-refresh/only-export-components
export const pandaImages: Record<PandaState, string> = {
    falling: pandaFall,
    standing: panda,
    down:pandaDown,
};



export const Panda: React.FC<PhysicsItem> = ({ position,size, velocity }:PhysicsItem) => {

    const state = velocity.y !== 0 ? 'falling' : 'standing';

    return (
        <div
        style={{
            position: 'absolute',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundImage: `url('${pandaImages[state]}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '50%',
            transition: 'none',
            pointerEvents: 'none',
        }}
        />
    );

};