
interface WallsProps {
    x: number;       
    z: number;       
    height?: number;  
    color?: string;   
}

export default function Walls({
    x,
    z,
    height = 3,
    color = '#ccc',
    }: WallsProps) {
    const wallThickness = 0.2;
    const yPos = height / 2;

    return (
        <>
        <mesh position={[wallThickness / 2, yPos, z / 1.7]} receiveShadow castShadow>
            <boxGeometry args={[wallThickness, height, z]} />
            <meshStandardMaterial color={color} />
        </mesh>

        <mesh position={[x - wallThickness / 2, yPos, z / 2]} receiveShadow castShadow>
            <boxGeometry args={[wallThickness, height, z]} />
            <meshStandardMaterial color={color} />
        </mesh>

        <mesh position={[x / 2, yPos, wallThickness / 2]} receiveShadow castShadow>
            <boxGeometry args={[x, height, wallThickness]} />
            <meshStandardMaterial color={color} />
        </mesh>

        <mesh position={[x / 2, yPos, z - wallThickness / 2]} receiveShadow castShadow>
            <boxGeometry args={[x, height, wallThickness]} />
            <meshStandardMaterial color={color} />
        </mesh>
        </>
    );
}
