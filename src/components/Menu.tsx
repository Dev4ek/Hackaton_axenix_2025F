import React, { useState } from "react";
import axios from "axios";

interface PropsMenu {
    setMaps: any
    setUser: React.Dispatch<React.SetStateAction<any[]>>;
    id_map: number | undefined;
    analitik: any;
}

const Menu: React.FC<PropsMenu> = ({ setMaps,analitik }) => {
const [isMapPopupOpen, setIsMapPopupOpen] = useState(false);
const [name, setName] = useState("");
const [x, setX] = useState(0);
const [z, setZ] = useState(0);

const addMap = async () => {
    try {
    const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/maps`,
        {
        name,
        x,
        z,
        }
    );
    setMaps((prev: any) => [...prev, response.data]);
    setIsMapPopupOpen(false);
    setName("");
    setX(0);
    setZ(0);
    } catch (error) {
    console.error(error);
    }
};

return (
    <>
    <div className="p-4">
        <button
        onClick={() => setIsMapPopupOpen(true)}
        className="mr-2 p-2 bg-blue-500 text-white rounded"
        >
        Добавить карту
        </button>
        <button
        onClick={() => analitik()}
        className="p-2 bg-green-500 text-white rounded"
        >
        Запустить симуляцию
        </button>
    </div>

    {isMapPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Добавление карты</h2>
            <div className="mb-4">
            <label className="block mb-1">Название карты:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите название карты"
                className="w-full p-2 border rounded"
            />
            </div>
            <div className="mb-4">
            <label className="block mb-1">Координата X:</label>
            <input
                type="number"
                value={x}
                onChange={(e) => setX(Number(e.target.value))}
                placeholder="Введите координату X"
                className="w-full p-2 border rounded"
            />
            </div>
            <div className="mb-4">
            <label className="block mb-1">Координата Z:</label>
            <input
                type="number"
                value={z}
                onChange={(e) => setZ(Number(e.target.value))}
                placeholder="Введите координату Z"
                className="w-full p-2 border rounded"
            />
            </div>
            <div className="flex justify-end">
            <button
                onClick={() => setIsMapPopupOpen(false)}
                className="mr-2 p-2 bg-gray-500 text-white rounded"
            >
                Отмена
            </button>
            <button
                onClick={addMap}
                className="p-2 bg-blue-500 text-white rounded"
            >
                Добавить
            </button>
            </div>
        </div>
        </div>
    )}
    </>
);
};

export default Menu;
