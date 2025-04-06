import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping } from 'three';


export default function Floor({ onPointerUp, onPointerMove, x, y, ...props }: any) {
    const texture = useLoader(TextureLoader, '../../public/pol.jpg');

    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(10, 10);

    return (
        <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[x / 2, 0, y / 2]}
        receiveShadow
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        {...props}
        >
        <planeGeometry args={[x, y]} />
        <meshStandardMaterial map={texture} />
        </mesh>
    );
}
