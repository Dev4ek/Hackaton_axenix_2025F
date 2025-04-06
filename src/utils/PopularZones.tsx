interface AggregatedZone {
    x: number;
    z: number;
    visits: number;
}

interface PopularZonesAggregatedProps {
    zones: AggregatedZone[];
    gridSize?: number;
}

const PopularZonesAggregated: React.FC<PopularZonesAggregatedProps> = ({ zones, gridSize = 1 }) => {
    if (!zones || zones.length === 0) return null;

    const maxVisits = Math.max(...(zones.map(zone => zone.visits) || [0]));

    const computedZones = zones.map(zone => {
        const intensity = zone.visits / maxVisits;
        const red = Math.floor(255 * intensity);
        const color = `rgb(${red}, 0, 0)`;
        return { ...zone, color };
    });

    return (
        <>
            {computedZones.map((zone, index) => (
                <mesh
                    key={index}
                    position={[zone.x + gridSize / 2, 0.02, zone.z + gridSize / 2]}
                    rotation-x={-Math.PI / 2}
                >
                    <planeGeometry args={[gridSize, gridSize]} />
                    <meshBasicMaterial color={zone.color} transparent opacity={0.6} />
                </mesh>
            ))}
        </>
    );
};


export default PopularZonesAggregated;
