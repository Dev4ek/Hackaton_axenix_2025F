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
products?: ProductData[];
}

export default function Shelf({
position,
label,
onClick,
color,
products = [],
}: ShelfProps) {
const shelfWidth = 2.5;
const shelfHeight = 4;
const shelfDepth = 0.5;
const shelfLevels = 3;
const shelfThickness = 0.05;

const shelfSpacing = shelfHeight / (shelfLevels + 1);

const offsetY = -shelfHeight / 2;

return (
    <group position={[position[0], position[1] + shelfHeight / 2, position[2]]} onClick={onClick}>
    <mesh castShadow position={[0, offsetY, 0]}>
        <boxGeometry args={[shelfWidth, shelfHeight, shelfThickness]} />
        <meshStandardMaterial color={color} />
    </mesh>

    <mesh position={[-shelfWidth / 2 + shelfThickness / 2, offsetY, shelfDepth / 2]}>
        <boxGeometry args={[shelfThickness, shelfHeight, shelfDepth]} />
        <meshStandardMaterial color="#888" />
    </mesh>
    <mesh position={[shelfWidth / 2 - shelfThickness / 2, offsetY, shelfDepth / 2]}>
        <boxGeometry args={[shelfThickness, shelfHeight, shelfDepth]} />
        <meshStandardMaterial color="#888" />
    </mesh>

    {[...Array(shelfLevels)].map((_, i) => {
        const y = offsetY + shelfSpacing * (i + 1);
        return (
        <mesh key={i} position={[0, y, shelfDepth / 2]}>
            <boxGeometry args={[shelfWidth - shelfThickness * 2, shelfThickness, shelfDepth]} />
            <meshStandardMaterial color="#aaa" />
        </mesh>
        );
    })}

    <Text
        position={[0, 0.3, 0.3]}
        fontSize={0.3}
        color="#000"
        anchorX="center"
        anchorY="middle"
    >
        {label}
    </Text>

    {/* Товары на полках */}
    {products.map((product, index) => {
        const columns = 4;
        const itemsPerShelf = columns;
        const level = Math.floor(index / itemsPerShelf);
        const positionInRow = index % columns;

        const xOffset = -shelfWidth / 2 + shelfThickness + 0.3 + positionInRow * 0.6;
        const yOffset = offsetY + shelfSpacing * (level + 1) + 0.2;
        const zOffset = shelfDepth / 2 + 0.05;

        return (
        <group key={product.id} position={[xOffset, yOffset, zOffset]}>
            <mesh>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color={product.color_hex} />
            </mesh>
            <Text
            position={[0, 0.25, 0]}
            fontSize={0.12}
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
