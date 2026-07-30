import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export const AdminCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [nombre, setNombre] = useState('');
    const [cargando, setCargando] = useState(true);

    const cargarCategorias = async () => {
        setCargando(true);
        try {
            const datos = await apiService.getCategorias();
            setCategorias(datos || []);
        } catch (e) {
            console.error(e);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    const handleCrear = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return alert('El nombre de la categoría es obligatorio');
        try {
            await apiService.crearCategoria({ nombre });
            setNombre('');
            cargarCategorias();
        } catch (e) {
            alert(e.message);
        }
    };

    const handleEliminar = async (id) => {
        try {
            await apiService.eliminarCategoria(id);
            cargarCategorias();
        } catch (e) {
            alert("No se puede eliminar la categoría. Asegúrate de que no tenga productos asociados.");
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleCrear} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex gap-4 items-center">
                <input 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    placeholder="Ej. Combos Familiares" 
                    className="border border-gray-300 rounded-lg px-4 py-2.5 flex-1 focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors cursor-pointer">
                    Añadir Categoría
                </button>
            </form>
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">ID</th>
                            <th className="p-4 font-semibold text-gray-600">Nombre</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categorias.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-gray-500">{c.id}</td>
                                <td className="p-4 font-medium text-gray-800">{c.nombre}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleEliminar(c.id)} className="text-red-500 hover:text-red-700 font-medium hover:underline cursor-pointer">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categorias.length === 0 && !cargando && (
                            <tr><td colSpan="3" className="p-8 text-center text-gray-500">No hay categorías registradas</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};