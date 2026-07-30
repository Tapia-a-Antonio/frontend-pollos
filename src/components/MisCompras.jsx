import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { ShoppingBag, Calendar, RefreshCw, PackageOpen } from 'lucide-react';

export const MisCompras = ({ setVistaActual }) => {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargarMisCompras = async () => {
        setCargando(true);
        setError(null);
        try {
            const datos = await apiService.getVentas();
            const emailUsuarioActual = localStorage.getItem('username'); // Correo del usuario logueado

            // Filtramos las ventas para que solo aparezcan las del cliente actual
            const misVentasFiltradas = (datos || []).filter(v => 
                v.cliente && v.cliente.email === emailUsuarioActual
            );

            setVentas(misVentasFiltradas);
        } catch (e) {
            setError(e.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarMisCompras();
    }, []);

    if (cargando) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="text-gray-500 mt-4 font-medium">Cargando tus compras...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 rounded-2xl p-8 text-white shadow-lg flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8" /> Mis Compras
                    </h1>
                    <p className="mt-2 text-indigo-100 text-sm">
                        Historial exclusivo de tus pedidos y estados de pago.
                    </p>
                </div>
                <button
                    onClick={cargarMisCompras}
                    className="hidden sm:flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-sm"
                >
                    <RefreshCw className="w-4 h-4" /> Actualizar
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm">
                    Error al cargar las compras: {error}
                </div>
            )}

            {ventas.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm space-y-4">
                    <PackageOpen className="w-16 h-16 text-indigo-300 mx-auto" />
                    <h3 className="font-bold text-xl text-gray-800">No tienes compras registradas</h3>
                    <p className="text-gray-500 text-sm">Explora nuestro catálogo y realiza tu primer pedido.</p>
                    <button
                        onClick={() => setVistaActual('catalogo')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors cursor-pointer shadow-md inline-block"
                    >
                        Ir al Catálogo
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {ventas.map((v) => (
                        <div key={v.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-2">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Folio de Pedido</span>
                                    <h3 className="text-lg font-black text-indigo-900">#{v.id}</h3>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                        <Calendar className="w-4 h-4 text-indigo-500" /> {v.fecha || 'N/A'}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        v.estadoPago === 'PAGADO' 
                                            ? 'bg-green-100 text-green-700 border border-green-200' 
                                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                                    }`}>
                                        {v.estadoPago || 'PENDIENTE'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-500 uppercase">Productos Adquiridos:</h4>
                                <div className="divide-y divide-gray-50">
                                    {v.detalles && v.detalles.length > 0 ? (
                                        v.detalles.map((detalle, idx) => (
                                            <div key={idx} className="py-2 flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-800">{detalle.producto?.nombre || 'Producto'}</span>
                                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">x{detalle.cantidad}</span>
                                                </div>
                                                <span className="font-semibold text-gray-700">${detalle.subtotal?.toFixed(2)} MXN</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 italic py-1">Detalles no disponibles.</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-600">Total Pagado</span>
                                <span className="text-xl font-extrabold text-indigo-900">
                                    ${v.total?.toFixed(2)} <span className="text-xs text-indigo-600">MXN</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};