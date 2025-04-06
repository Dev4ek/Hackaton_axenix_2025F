import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AnimatedCustomerAgent({ path, color }: any) {
const meshRef = useRef<THREE.Mesh>(null!);
const [currentIndex, setCurrentIndex] = useState<number>(0);
const [startTime, setStartTime] = useState<number | null>(null);

const timeScale = 0.01;

useEffect(() => {
    setStartTime(Date.now());
    setCurrentIndex(0);
}, [path]);

useFrame(() => {
    if (!meshRef.current || !path || path.length === 0 || startTime === null) return;

    const currentTime = Date.now();
    const elapsed = (currentTime - startTime) * timeScale;
    const simStartTime = path[0].time;

    if (currentIndex < path.length - 1) {
    const pointA = path[currentIndex];
    const pointB = path[currentIndex + 1];

    const segmentDuration = pointB.time - pointA.time;
    const segmentElapsed = elapsed - (pointA.time - simStartTime);
    let t = segmentDuration > 0 ? segmentElapsed / segmentDuration : 0;
    t = Math.min(t, 1);

    const currentX = pointA.x + (pointB.x - pointA.x) * t;
    const currentZ = pointA.z + (pointB.z - pointA.z) * t;
    meshRef.current.position.set(currentX, 0, currentZ);

    if (t >= 1 && currentIndex < path.length - 1) {
        setCurrentIndex(currentIndex + 1);
    }
    } else {
    const lastPoint = path[path.length - 1];
    meshRef.current.position.set(lastPoint.x, 0, lastPoint.z);
    }
});

return (
    <mesh ref={meshRef}>
    <sphereGeometry args={[0.3, 16, 16]} />
    <meshStandardMaterial color={color} />
    </mesh>
);
}
