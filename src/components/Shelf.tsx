import { Text } from '@react-three/drei';

interface ProductData {
id: number;
name: string;
shelf_id: number;
color_hex: string;
percent_discount?: number;
time_discount_start?: number;
time_discount_end?: number;
}

interface ShelfProps {
position: [number, number, number];
label: string;
color: string;
onClick?: () => void;
// Добавим массив продуктов
products?: ProductData[];
}

export default function Shelf({ position, label, onClick, color, products = [] }: ShelfProps) {
return (
    <group position={position} onClick={onClick}>
    {/* Сам корпус полки */}
    <mesh castShadow>
        <boxGeometry args={[2.5, 4.5, 0.2]} />
        <meshStandardMaterial color={color} />
    </mesh>

    <Text
        position={[0, 1, 0.51]}
        fontSize={0.3}
        color="#000"
        anchorX="center"
        anchorY="middle"
    >
        {label}
    </Text>

    {products.map((product, i) => {
        const gridColumns = 3; 
        const row = Math.floor(i / gridColumns);
        const col = i % gridColumns;
        
        const offsetX = col; 
        const offsetY = 0.3 + row; 
        const offsetZ = 0;

        return (
            <group key={product.id} position={[offsetX, offsetY, offsetZ]}>
            <mesh>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial color={product.color_hex} />
            </mesh>
            <Text
                position={[0, 0.3, 0]}
                fontSize={0.15}
                color="#000"
                anchorX="center"
                anchorY="bottom"
            >
                {product.name}
            </Text>
            </group>
        );
        })}
    </group>
);
}
