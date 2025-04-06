
import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import axios from 'axios';

import Floor from './components/Floor';
import Shelf from './components/Shelf';
import CashRegister from './components/CashRegister';
import CustomerAgent from './components/CustomerAgent';
import DragDropMenu from './components/DragDropMenu';
import Menu from './components/Menu';
import Entrance from './components/Etrance';
import Walls from './components/Walls';
import AnimatedCustomerAgent from './utils/AnimateAgent';
import PopularZonesAggregated from './utils/PopularZones';

// Типы
interface ProductData {
  id: number;
  name: string;
  shelf_id: number;
  color_hex: string;
  percent_discount?: number;
  time_discount_start?: number;
  time_discount_end?: number;
}

interface ShelfData {
  id: number;
  label: string;
  position: [x: number, y: number, z: number];
  color: string;
  products?: ProductData[]; // теперь внутри ShelfData есть массив продуктов
}

interface PlacedCashRegister {
  id: number;
  position: [number, number, number];
}

interface Maps {
  id: number;
  name: string;
  x: number;
  z: number;
}

interface UserAgent {
  id: number;
  map_id: number;
}

export default function App() {
  // const [cartCount, setCartCount] = useState(0);
  const [selectMaps, setSelectMaps] = useState<Maps | null>(null);
  const [MapsArr, setMapsArr] = useState<Maps[]>([]);

  const [draggingItem, setDraggingItem] = useState<'shelf' | 'cashRegister' | null>(null);

  // Вся информация о полках, теперь каждая полка может содержать products
  const [shelvesData, setShelvesData] = useState<ShelfData[]>([]);

  const [placedCashRegisters, setPlacedCashRegisters] = useState<PlacedCashRegister[]>([]);
  const [userAgentData, setUserAgentData] = useState<UserAgent[]>([]);

  const [Categorys] = useState<string[]>([
    'Молочные продукты', 'Овощи', 'Крупы', 'Бытовая химия',
    'Лекарства', 'Готовая еда', 'Перекусы', 'Энергетики',
    'Фрукты', 'Детские товары', 'Экопродукты', 'Сезонные товары'
  ]);

  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number; z: number }>({
    x: 0,
    y: 0,
    z: 0,
  });

  const [showShelfModal, setShowShelfModal] = useState(false); 
  const [newShelfPosition, setNewShelfPosition] = useState<[number, number, number] | null>(null);
  const [newShelfName, setNewShelfName] = useState('');
  const [newShelfCategory, setNewShelfCategory] = useState('');
  const [newShelfColor, setNewShelfColor] = useState('#ffffff');
  const [Capacity, setCapacity] = useState<number>();
  const [loading , setLoading] = useState(false);

  const [showProductModal, setShowProductModal] = useState(false);
  const [currentShelfId, setCurrentShelfId] = useState<number | null>(null);

  const [newProductName, setNewProductName] = useState('');
  const [newProductColor, setNewProductColor] = useState('#ffffff');
  const [newProductDiscount, setNewProductDiscount] = useState<number | undefined>(undefined);
  const [newProductDiscountStart, setNewProductDiscountStart] = useState<number | undefined>(undefined);
  const [newProductDiscountEnd, setNewProductDiscountEnd] = useState<number | undefined>(undefined);
  const [dataAnalitik, setDataAnalitik] = useState<any>()
  const [valuePeople, setValuePeople] = useState<number>(50)
  const [FastWork, setFastWork] = useState<any>(false)

  const [tovary, setTovary] = useState<any>();

  const colors = ['#87CEFA', '#FFB6C1', '#98FB98', '#FFA500', '#9370DB', '#FFFF00'];


  // ============================================================
  //      ФУНКЦИИ ДЛЯ РАБОТЫ С ПОЛКАМИ
  // ============================================================
  const handleCreateShelf = async () => {
    if (!selectMaps || !newShelfPosition) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/shelves`,
        {
          name: newShelfName,
          map_id: selectMaps.id,
          category: newShelfCategory,
          color_hex: newShelfColor,
          capacity: Capacity,
          x: newShelfPosition[0],
          y: newShelfPosition[1] ?? 0,
          z: newShelfPosition[2]
        }
      );

      if (response.status === 200 || response.status === 201) {
        const newShelfId = response.data.id;


        setShelvesData((prev) => [
          ...prev,
          {
            id: newShelfId,
            label: newShelfName,
            color: newShelfColor,
            position: newShelfPosition,
            products: [], 
          },
        ]);
      } else {
        console.error('Ошибка создания полки', response);
      }
    } catch (error) {
      console.error('Ошибка создания полки', error);
    }

    setShowShelfModal(false);
    setNewShelfName('');
    setNewShelfCategory('');
    setNewShelfColor('#ffffff');
  };

  const handleShelfDelete = async (index: number) => {
    const shelf = shelvesData[index];
    if (!shelf) return;

    if (window.confirm(`Удалить полку "${shelf.label}"?`)) {
      setShelvesData((prev) => prev.filter((_, i) => i !== index));

      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/shelves/${shelf.id}`);
      } catch (error) {
        console.error('Error deleting shelf', error);
      }
    }
  };

  const GetAnalitik = async () => {
    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/simulations/start`,
        {
          map_id: selectMaps?.id,
          num_persons: valuePeople
        }
      );      
      if (response.status === 200) {
        setDataAnalitik(response.data);
        setLoading(false)
      } else {
        console.error('Error fetching analytics', response);
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching analytics', error);
      setLoading(false)
    }
  };
  

  const getShelf = async () => {
    if (!selectMaps) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/shelves/maps/${selectMaps.id}`
      );
      if (response.status === 200) {
        const shelfData = response.data.map((item: any) => ({
          id: item.id,
          label: item.name,
          color: item.color_hex,
          position: [item.x, 0, item.z] as [number, number, number],
          products: item.products || [], 
        }));
        setShelvesData(shelfData);
      } else {
        console.error('Error fetching shelves', response);
      }
    } catch (error) {
      console.error('Error fetching shelves', error);
    }
  };

  // ============================================================
  //      ФУНКЦИИ ДЛЯ РАБОТЫ С ТОВАРАМИ
  // ============================================================
  const openProductModal = (shelfId: number) => {
    setCurrentShelfId(shelfId);
    setShowProductModal(true);
  };

  const handleCreateProduct = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/shevles/${currentShelfId}`);
      if (res.status === 200) {
        const result = res.data;
        setTovary(result);
  
        const existingProduct = result.products.find((product: any) => product.toLowerCase() === newProductName.toLowerCase());
        console.log(existingProduct)
  
        if (existingProduct) {
          // Если продукт существует, просто получаем данные по нему
          try {
            const existingProductRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`);
            console.log('Существующий продукт:', existingProductRes.data);
          } catch (err) {
            console.error('Ошибка при получении существующего продукта', err);
          }
          return;
        }
      } else {
        console.error('Ошибка при получении продуктов', res);
      }
    } catch (error) {
      console.error('Ошибка при получении продуктов', error);
    }
  
    if (!currentShelfId || !newProductName) {
      alert('Заполните название товара');
      return;
    }
  
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/categories/create`, {
        name: tovary?.name, 
        product_add: newProductName
      });
  
      const payload: any = {
        name: newProductName,
        shelf_id: currentShelfId,
        color_hex: newProductColor,
      };
      if (newProductDiscount !== undefined) payload.percent_discount = newProductDiscount;
      if (newProductDiscountStart !== undefined) payload.time_discount_start = newProductDiscountStart;
      if (newProductDiscountEnd !== undefined) payload.time_discount_end = newProductDiscountEnd;
  
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/products`, payload);
      if (response.status === 200 || response.status === 201) {
        const createdProduct = response.data;
  
        setShelvesData((prevShelves) =>
          prevShelves.map((shelf) => {
            if (shelf.id === currentShelfId) {
              return {
                ...shelf,
                products: shelf.products
                  ? [...shelf.products, createdProduct]
                  : [createdProduct],
              };
            }
            return shelf;
          })
        );
  
        // Сброс формы
        setShowProductModal(false);
        setNewProductName('');
        setNewProductColor('#ffffff');
        setNewProductDiscount(undefined);
        setNewProductDiscountStart(undefined);
        setNewProductDiscountEnd(undefined);
      } else {
        console.error('Ошибка создания товара', response);
      }
    } catch (error) {
      console.error('Ошибка создания товара', error);
    }
  };

  // ============================================================
  //      ФУНКЦИИ ДЛЯ АГЕНТОВ, КАСС, КАРТ
  // ============================================================
  const AddUserData = async () => {
    if (!selectMaps) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/persons/maps/${selectMaps.id}`);
      if (response.status === 200) {
        setUserAgentData(response.data);
      } else {
        console.error('Error fetching user agent', response);
      }
    } catch (error) {
      console.error('Error fetching user agent', error);
    }
  };

  const GetMaps = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/maps`);
      if (response.status === 200) {
        setMapsArr(response.data);
      } else {
        console.error('Error fetching maps', response);
      }
    } catch (error) {
      console.error('Error fetching maps', error);
    }
  };

  const getCashRegisters = async () => {
    if (!selectMaps) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/kasses/maps/${selectMaps.id}`
      );
      if (response.status === 200) {
        setPlacedCashRegisters(
          response.data.map((item: any) => ({
            id: item.id,
            position: [item.x, 0.5, item.z],
          }))
        );
      } else {
        console.error('Ошибка получения касс', response);
      }
    } catch (error) {
      console.error('Ошибка получения касс', error);
    }
  };

  // ============================================================
  //      ОБРАБОТЧИКИ DRAG & DROP
  // ============================================================
  const handleFloorDrop = async (e: any) => {
    if (!draggingItem || !selectMaps) return;
    const point = e.point as Vector3;
  
    const roundedX = Math.round(point.x);
    const roundedY = Math.round(point.y);
    const roundedZ = Math.round(point.z);
  
    if (draggingItem === 'shelf') {
      setNewShelfPosition([roundedX, roundedY, roundedZ]);
      setShowShelfModal(true);
    } else if (draggingItem === 'cashRegister') {
      try {
        const payload = {
          name: `Касса ${placedCashRegisters.length + 1}`,
          map_id: selectMaps.id,
          x: roundedX,
          z: roundedZ,
        };
  
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/kasses`,
          payload
        );
  
        if (response.status === 200 || response.status === 201) {
          const createdCashRegister = response.data;
          setPlacedCashRegisters((prev) => [
            ...prev,
            {
              id: createdCashRegister.id,
              position: [roundedX, roundedY + 0.5, roundedZ],
            },
          ]);
        } else {
          console.error('Ошибка создания кассы', response);
        }
      } catch (error) {
        console.error('Ошибка создания кассы', error);
      }
    }
  
    setDraggingItem(null);
  };
  


  const handlePointerMove = (e: any) => {
    const point = e.point as Vector3;
    setHoverCoords({ x: point.x, y: point.y, z: point.z });
  };

  // ============================================================
  //      useEffect
  // ============================================================
  useEffect(() => {
    GetMaps();
  }, []);

  useEffect(() => {
    if (selectMaps) {
      getShelf();
      AddUserData();
      getCashRegisters();
    }
  }, [selectMaps]);

  // ============================================================
  //      RENDER
  // ============================================================
  return (
    <div className="w-screen h-screen bg-gray-100 flex">
      <div className="flex flex-col bg-gray-300">
        <DragDropMenu setDraggingItem={setDraggingItem} />
        <Menu setMaps={setMapsArr} setUser={setUserAgentData} id_map={selectMaps?.id} analitik={GetAnalitik}/>
        {loading && 
          <div className="flex justify-center items-center h-full w-full text-gray-500">
            Загрузка...
          </div>
        }
        <div className="w-full max-w-md mx-auto p-4">
          <input
            type="number"
            placeholder="Введите кол-во клиентов для симуляции"
            value={valuePeople}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValuePeople(Number(e.target.value))}
          />
        </div>

        <div className='w-full max-w-md mx-auto p-4'>
          <button
            onClick={() => setFastWork(true)}
            className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            Быстрая симуляция
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        <Canvas shadows camera={{ position: [0, 20, 15], fov: 60 }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 15, 10]} intensity={0.8} castShadow />
          <directionalLight
            position={[0, 10, 0]}
            intensity={0.5}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <Floor
            onPointerUp={handleFloorDrop}
            onPointerMove={handlePointerMove}
            x={selectMaps?.x}
            y={selectMaps?.z}
          />

          {selectMaps && (
            <Walls
              x={selectMaps.x}
              z={selectMaps.z}
              height={3.5}
              color="#f0f0f0"
            />
          )}

          {selectMaps && (
            <Entrance
              position={[0,0,0]}
              doorWidth={2}
              doorHeight={3}
              frameColor="#654321"
              arrowColor="#ff0000"
            />
          )}

          {draggingItem === 'shelf' && (
            <Shelf
              position={[hoverCoords.x, hoverCoords.y + 1.5, hoverCoords.z]}
              label="Полка (предпросмотр)"
              color="#cccccc"
            />
          )}

          {draggingItem === 'cashRegister' && (
            <CashRegister
              position={[hoverCoords.x, hoverCoords.y + 0.5, hoverCoords.z]}
            />
          )}

          {shelvesData.map((shelf, index) => (
            <Shelf
              key={shelf.id}
              position={shelf.position}
              label={shelf.label}
              color={shelf.color}
              onClick={() => handleShelfDelete(index)}
              products={shelf.products} // вот тут!
            />
          ))}

          {placedCashRegisters.map((cr) => (
            <CashRegister key={cr.id} position={cr.position} />
          ))}

          {userAgentData.map((agent, index) => {

            const startX = (selectMaps?.x ?? 0) / 2.2 + index * 0.3;
            const startZ = (selectMaps?.z ?? 0) / 2 + index * 0.3;
            const targetX = -2 + Math.sin(index) * 2;
            const targetZ = -2 + Math.cos(index) * 2;
            const finalX = 6 + index * 0.1;
            const finalZ = 6 - index * 0.1;

            return (
              <CustomerAgent
                key={agent.id || index}
                start={new Vector3(startX, 0, startZ + 1)}
                target={new Vector3(targetX, 0.4, targetZ + 1)}
                final={new Vector3(finalX, 0.4, finalZ + 1)}
                color={colors[index]}
              />
            );
          })}

        {dataAnalitik?.results.map((result:any, index:number) => (
            <AnimatedCustomerAgent 
              key={result.client} 
              path={result.path} 
              color={colors[index % colors.length]}
              fast={FastWork} 
            />
    ))}
          <PopularZonesAggregated zones={dataAnalitik?.popular_zones} gridSize={1} />

          <OrbitControls />
        </Canvas>

        {/* Блок информации (полки, товары, координаты) */}
        <div className="absolute top-4 right-4 bg-white p-4 shadow-lg rounded w-80 max-h-[90vh] overflow-auto">
          <h2 className="text-lg font-semibold mb-2">Статистика</h2>
          <ul className="text-sm">
            <li>Всего клиентов: {dataAnalitik?.statistics.total_clients ?? 0}</li>
            <li>Завершили покупки: {dataAnalitik?.statistics.completed ?? 0}</li>
            <li>Покинули из-за очереди: {dataAnalitik?.statistics.left_due_to_queue ?? 0}</li>
            <li>Магазин закрыт: {dataAnalitik?.statistics.store_closed ?? 0}</li>
            <li>Нет кассы: {dataAnalitik?.statistics.no_kassa ?? 0}</li>
            <li>Нет пути к кассе: {dataAnalitik?.statistics.no_path_to_kassa ?? 0}</li>
            <li>Нет пути к полке: {dataAnalitik?.statistics.no_path_to_shelf ?? 0}</li>
            <li>Нет начальной позиции: {dataAnalitik?.statistics.no_start_position ?? 0}</li>
            <li>Всего покупок: {dataAnalitik?.statistics.total_purchases ?? 0}</li>
            <li>Мотивов: {dataAnalitik?.statistics.motive_trigger_count ?? 0}</li>
            <li>Страхов: {dataAnalitik?.statistics.fear_trigger_count ?? 0}</li>
            <li>Скидок сработало: {dataAnalitik?.statistics.discount_trigger_count ?? 0}</li>
            <li>Поломок касс: {dataAnalitik?.statistics.kassa_breakdowns ?? 0}</li>
          </ul>

          <h2 className="text-lg font-semibold mt-4 mb-2">Рекомендации</h2>
          <ul className="text-xs">
            {dataAnalitik?.recommendations?.map((rec: string, idx: number) => (
              <li key={idx} className="border-b py-1">
                {rec}
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute bottom-4 left-4 bg-white p-4 shadow-lg rounded w-72">
          <h2 className="text-lg font-semibold mb-2">Информация</h2>
          <p>
            Координаты: X: {hoverCoords.x.toFixed(2)} | Y: {hoverCoords.y.toFixed(2)} | Z: {hoverCoords.z.toFixed(2)}
          </p>

          <div className="mt-2 max-h-60 overflow-auto">
            <h3 className="font-semibold">Полки:</h3>
            {shelvesData.map((shelf) => (
              <div key={shelf.id} className="border-b py-1">
                <div className="text-sm">
                  Полка <b>«{shelf.label}»</b> (id: {shelf.id})<br/>
                  X: {shelf.position[0].toFixed(2)}, 
                  Y: {shelf.position[1].toFixed(2)}, 
                  Z: {shelf.position[2].toFixed(2)}
                </div>
                <p className="text-xs">
                  Товаров: {shelf.products?.length ?? 0}
                </p>
                <button
                  onClick={() => openProductModal(shelf.id)}
                  className="mt-1 text-xs px-2 py-1 bg-green-300 hover:bg-green-400"
                >
                  Добавить товар
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="absolute top-4 left-4 bg-white p-4 shadow-lg rounded">
          <h2 className="text-lg font-semibold">Корзина</h2>
          <p>Куплено товаров: {cartCount}</p>
        </div> */}

        <div className="absolute top-4 left-60 bg-white p-4 shadow-lg rounded">
          <h3 className="font-semibold">Карты магазинов:</h3>
          <ul>
            {MapsArr.map((map, index) => (
              <li
                key={map.id}
                onClick={() => setSelectMaps(map)}
                className="mt-2 bg-sky-300/75 cursor-pointer p-1"
              >
                Карта {index + 1}: {map.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Модальное окно для создания полки */}
      {showShelfModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 w-80">
            <h2 className="font-bold text-lg mb-2">Создать новую полку</h2>

            <label className="block mb-1">Название полки:</label>
            <input
              className="border p-1 w-full mb-2"
              value={newShelfName}
              onChange={(e) => setNewShelfName(e.target.value)}
            />

            <label className="block mb-1">Кол-во вмещаемых элементов:</label>
            <input
              className="border p-1 w-full mb-2"
              value={Capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />

            <label className="block mb-1">Категория:</label>
            <select
              className="border p-1 w-full mb-2"
              value={newShelfCategory}
              onChange={(e) => setNewShelfCategory(e.target.value)}
            >
              <option value="">— выбрать —</option>
              {Categorys.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>

            <label className="block mb-1">Цвет (hex):</label>
            <input
              className="border p-1 w-full mb-2"
              value={newShelfColor}
              onChange={(e) => setNewShelfColor(e.target.value)}
              placeholder="#ffffff"
            />

            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 mr-2"
                onClick={handleCreateShelf}
              >
                Сохранить
              </button>
              <button
                className="bg-gray-300 px-4 py-2"
                onClick={() => setShowShelfModal(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для создания нового товара */}
      {showProductModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 w-80">
            <h2 className="font-bold text-lg mb-2">Добавить товар</h2>
            
            <label className="block mb-1">Название товара:</label>
            <input
              className="border p-1 w-full mb-2"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />

            <label className="block mb-1">Цвет (hex):</label>
            <input
              className="border p-1 w-full mb-2"
              value={newProductColor}
              onChange={(e) => setNewProductColor(e.target.value)}
            />

            <label className="block mb-1">Скидка (%):</label>
            <input
              className="border p-1 w-full mb-2"
              type="number"
              value={newProductDiscount ?? ''}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : undefined;
                setNewProductDiscount(val);
              }}
            />

            <label className="block mb-1">Время начала скидки (сек.):</label>
            <input
              className="border p-1 w-full mb-2"
              type="number"
              value={newProductDiscountStart ?? ''}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : undefined;
                setNewProductDiscountStart(val);
              }}
            />

            <label className="block mb-1">Время окончания скидки (сек.):</label>
            <input
              className="border p-1 w-full mb-2"
              type="number"
              value={newProductDiscountEnd ?? ''}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : undefined;
                setNewProductDiscountEnd(val);
              }}
            />

            <div className="flex justify-end">
              <button
                className="bg-green-500 text-white px-4 py-2 mr-2"
                onClick={handleCreateProduct}
              >
                Сохранить
              </button>
              <button
                className="bg-gray-300 px-4 py-2"
                onClick={() => setShowProductModal(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
