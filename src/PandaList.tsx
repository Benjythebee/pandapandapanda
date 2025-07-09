import React from "react";
import type { PhysicsItem } from "./types";
import { Panda } from "./panda";

export const PandaList: React.FC<{itemIds:string[],items:Map<string,PhysicsItem>}> = ({itemIds,items}) => {

    // Memoized Panda component

      const areEqual = (
        prevProps: Omit<PhysicsItem, 'id'> & { id: string },
        nextProps: Omit<PhysicsItem, 'id'> & { id: string }
      ) => {
        return (
          prevProps.id === nextProps.id &&
          prevProps.size === nextProps.size &&
          prevProps.color === nextProps.color &&
          prevProps.position.x === nextProps.position.x &&
          prevProps.position.y === nextProps.position.y &&
          prevProps.velocity.x === nextProps.velocity.x &&
          prevProps.velocity.y === nextProps.velocity.y
        );
      };

      const MemoPanda = React.memo(Panda, areEqual);

      return  itemIds.map((id) => {
          const item =  items.get(id);
          if (!item) return null; // Safety check
          return <MemoPanda
            key={item.id}
            position={item.position}
            size={item.size}
            velocity={item.velocity}
            id={item.id}
            color={item.color}
          />
        })
}