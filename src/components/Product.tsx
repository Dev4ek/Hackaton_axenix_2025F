
interface ProductProps {
    position: [number, number, number];
    color: string;
    onClick?: () => void;
}

export default function Product({ position, color, onClick }: ProductProps) {
    return (
        <mesh position={position} castShadow onClick={onClick}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}
