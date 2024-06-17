// hello
import React, { useEffect, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';

export default function Model2() {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/hi.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      actions['metarig.003Action'].play();
    }
  }, [actions]);

  return <primitive ref={group} object={scene} scale={0.5} position={[0, -0.3, 0]} />;
}
