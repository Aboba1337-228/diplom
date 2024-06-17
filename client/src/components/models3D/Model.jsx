// base
import React, { useEffect, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';

export default function Model() {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/base.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      actions['metarigAction'].play();
    }
  }, [actions]);

  return <primitive ref={group} object={scene} scale={0.5} position={[0, -0.3, 0]} />;
}