
interface DragDropMenuProps {
    setDraggingItem: (item: 'shelf' | 'cashRegister' | null) => void;
}

export default function DragDropMenu({ setDraggingItem }: DragDropMenuProps) {
    return (
        <>
            <div className="p-4">
                <button
                    onMouseDown={() => setDraggingItem('shelf')}
                    onMouseUp={() => setDraggingItem(null)}
                    className="mr-2 p-2 bg-blue-500 text-white rounded"
                >
                    Перетащить полку
                </button>
                <button
                    onMouseDown={() => setDraggingItem('cashRegister')}
                    onMouseUp={() => setDraggingItem(null)}
                    className="p-2 bg-green-500 text-white rounded"
                >
                    Перетащить кассу
                </button>
            </div>
        </>
    );
}
