import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group } from 'three';

interface CustomerProps {
start: Vector3;
target: Vector3;
final: Vector3;
color?: string;
}

export default function CustomerAgent({ target, final, color = 'skyblue' }: CustomerProps) {
const ref = useRef<Group>(null);
const phase = useRef<'toShelf' | 'toCash' | 'done'>('toShelf');
const speed = 0.02;
const pos = useRef(new Vector3(0, 0, 0)); // переместили на ноль
const directionRef = useRef(new Vector3(0, 0, 1)); // направление движения по умолчанию

useFrame(() => {
    if (!ref.current) return;

    const currentTarget = phase.current === 'toShelf' ? target : final;
    const direction = new Vector3().subVectors(currentTarget, pos.current);
    const distance = direction.length();

    if (distance > 0.05) {
    direction.normalize();
    directionRef.current.copy(direction); // сохраняем направление
    pos.current.add(direction.multiplyScalar(speed));
    ref.current.position.copy(pos.current);
    } else {
    if (phase.current === 'toShelf') phase.current = 'toCash';
    else if (phase.current === 'toCash') phase.current = 'done';
    }
});

return (
    <group ref={ref} position={[0, 0, 0]}>
    <mesh castShadow>
        <cylinderGeometry args={[0.25, 0.35, 1, 32]} />
        <meshStandardMaterial color={color} />
    </mesh>
    <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={color} />
    </mesh>
    {/* Глаз, указывающий направление */}
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
