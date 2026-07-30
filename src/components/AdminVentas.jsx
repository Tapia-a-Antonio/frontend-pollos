import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export const AdminVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarVentas = async () => {
            try {
                const datos = await apiService.getVentas();
                setVentas(datos || []);
            } catch (e) {
                console.error(e);
            } finally {
                setCargando(false);
            }
        };
        cargarVentas();
    }, []);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-800">Historial de Transacciones</h3>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-gray-200">
                    <tr>
                        <th className="p-4 font-semibold text-gray-600">Folio</th>
                        <th className="p-4 font-semibold text-gray-600">Fecha</th>
                        <th className="p-4 font-semibold text-gray-600">Cliente</th>
                        <th className="p-4 font-semibold text-gray-600">Total</th>
                        <th className="p-4 font-semibold text-gray-600">Estado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {ventas.map(v => (
                        <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-bold text-indigo-600">#{v.id}</td>
                            <td className="p-4 text-gray-600">{v.fecha}</td>
                            <td className="p-4 text-gray-800">{v.cliente?.nombre || 'Público General'}</td>
                            <td className="p-4 font-bold text-gray-800">${v.total.toFixed(2)}</td>
                            <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${v.estadoPago === 'PAGADO' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {v.estadoPago}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {ventas.length === 0 && !cargando && (
                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">Aún no tienes ventas registradas.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};