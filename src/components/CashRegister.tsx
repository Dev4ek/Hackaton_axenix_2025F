
interface CashRegisterProps {
    position: [number, number, number];
}

export default function CashRegister({ position }: CashRegisterProps) {
    return (
        <mesh position={position} castShadow>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial color="#222222" />
        </mesh>
    );
}
