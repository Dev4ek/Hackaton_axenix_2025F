import { useEffect } from 'react';
import Shelf from '../components/Shelf';

interface ShelfData {
    label: string;
    position: [number, number, number];
    color: string;
}

interface GenerateProductsProps {
    shelvesData: ShelfData[];
    onShelfClick: (index: number) => void;
}

export default function generateProducts({ shelvesData, onShelfClick }: GenerateProductsProps) {
    useEffect(() => {
        console.log(121312)
    },[shelvesData])
        
    return shelvesData.map((shelf, index) => (
        <Shelf
        key={index}
        position={shelf.position}
        label={shelf.label}
        color={shelf.color}
        onClick={() => onShelfClick(index)}
        />
    ));
}
