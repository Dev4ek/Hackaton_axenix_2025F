import { FC } from 'react';
import { MeshStandardMaterial } from 'three';

interface EntranceProps {
    doorWidth?: number;
    doorHeight?: number;
    frameThickness?: number;
    position?: [number, number, number];
    offset?: [number, number, number];
    frameColor?: string;
    arrowColor?: string;
}

const Entrance: FC<EntranceProps> = ({
    doorWidth = 2,
    doorHeight = 3,
    frameThickness = 0.1,
    position = [0, 0, 0],
    offset = [0, 0, 1], 
    frameColor = '#654321',
    arrowColor = '#ff0000',
    ...props
    }) => {
    const frameMaterial = new MeshStandardMaterial({ color: frameColor });
    const arrowMaterial = new MeshStandardMaterial({ color: arrowColor });

    const finalPosition: [number, number, number] = [
        position[0] + offset[0],
        position[1] + offset[1],
        position[2] + offset[2],
    ];

    return (
        <group rotation={[0, Math.PI / 2, 0]} position={finalPosition} {...props}>
            {/* Левая стойка */}
            <mesh
                position={[-doorWidth / 2 + frameThickness / 2, doorHeight / 2, 0]}
                castShadow
                receiveShadow
            >
                <boxGeometry args={[frameThickness, doorHeight, frameThickness]} />
                <primitive object={frameMaterial} attach="material" />
            </mesh>

            {/* Правая стойка */}
            <mesh
                position={[doorWidth / 2 - frameThickness / 2, doorHeight / 2, 0]}
                castShadow
                receiveShadow
            >
                <boxGeometry args={[frameThickness, doorHeight, frameThickness]} />
                <primitive object={frameMaterial} attach="material" />
            </mesh>

            {/* Верхняя перекладина */}
            <mesh
                position={[0, doorHeight - frameThickness / 2, 0]}
                castShadow
                receiveShadow
            >
                <boxGeometry args={[doorWidth, frameThickness, frameThickness]} />
                <primitive object={frameMaterial} attach="material" />
            </mesh>

            {/* Стрелка над дверью */}
            <group position={[0, doorHeight + 1, 0]}>
                <mesh rotation={[Math.PI, 0, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
                    <primitive object={arrowMaterial} attach="material" />
                </mesh>
                <mesh position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[0.15, 0.3, 16]} />
                    <primitive object={arrowMaterial} attach="material" />
                </mesh>
            </group>
        </group>
    );
};

export default Entrance;
