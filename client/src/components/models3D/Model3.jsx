// like
import React, { useEffect, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';

export default function Model3() {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/like.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      actions['metarig.003Action.001'].play();
    }
  }, [actions]);

  return <primitive ref={group} object={scene} scale={0.5} position={[0, -0.3, 0]} />;
}