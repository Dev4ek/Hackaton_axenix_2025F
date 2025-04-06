import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AnimatedCustomerAgent({ path, color }: any) {
const groupRef = useRef<THREE.Group>(null!);
const [currentIndex, setCurrentIndex] = useState<number>(0);
const [startTime, setStartTime] = useState<number | null>(null);
const directionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 1)); // стартовое направление

const timeScale = 0.001;

useEffect(() => {
    setStartTime(Date.now());
    setCurrentIndex(0);
}, [path]);

    useFrame(() => {
        if (!groupRef.current || !path || path.length === 0 || startTime === null) return;

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
        const position = new THREE.Vector3(currentX, 0, currentZ);

        // Вычисляем направление
        const newDir = new THREE.Vector3(pointB.x - pointA.x, 0, pointB.z - pointA.z).normalize();
        if (newDir.length() > 0) directionRef.current = newDir;

        groupRef.current.position.copy(position);

        if (t >= 1 && currentIndex < path.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
        } else {
        const lastPoint = path[path.length - 1];
        groupRef.current.position.set(lastPoint.x, 0, lastPoint.z);
        }
    });

    return (
        <group ref={groupRef}>
        {/* Тело */}
        <mesh castShadow>
            <cylinderGeometry args={[0.25, 0.35, 1, 32]} />
            <meshStandardMaterial color={color} />
        </mesh>

        {/* Голова */}
        <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color={color} />
        </mesh>

        {/* Глаз — указывает направление */}
        <mesh
            position={[
            directionRef.current.x * 0.3,
            0.9,
            directionRef.current.z * 0.3,
            ]}
        >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="white" />
        </mesh>
        </group>
    );
}
