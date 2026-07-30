import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { PackagePlus, Edit3, Trash2, RefreshCw, AlertCircle, X } from 'lucide-react';

export const Inventario = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Estado para controlar si estamos editando y qué producto es
    const [editandoId, setEditandoId] = useState(null);

    // Campos del formulario
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagenUrl, setImagenUrl] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [proveedorId, setProveedorId] = useState('');

    const [guardando, setGuardando] = useState(false);
    const [formError, setFormError] = useState(null);

    const cargarDatos = async () => {
        setCargando(true);
        setError(null);
        try {
            const [dataProductos, dataCategorias, dataProveedores] = await Promise.all([
                apiService.getProductos(),
                apiService.getCategorias(),
                apiService.getProveedores()
            ]);
            setProductos(dataProductos ?? []);
            setCategorias(dataCategorias ?? []);
            setProveedores(dataProveedores ?? []);
        } catch (e) {
            setError(e.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // Preparar el formulario para editar un producto existente
    const iniciarEdicion = (p) => {
        setEditandoId(p.id);
        setNombre(p.nombre || '');
        setPrecio(p.precio || '');
        setStock(p.stock || '');
        setDescripcion(p.descripcion || '');
        setImagenUrl(p.imagenUrl || '');
        setCategoriaId(p.categorias?.id || '');
        setProveedorId(p.proveedor?.id || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Cancelar la edición y limpiar campos
    const cancelarEdicion = () => {
        setEditandoId(null);
        setNombre('');
        setPrecio('');
        setStock('');
        setDescripcion('');
        setImagenUrl('');
        setCategoriaId('');
        setProveedorId('');
        setFormError(null);
    };

    // Guardar (Crear o Actualizar)
    const handleGuardar = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!nombre.trim()) return setFormError('El nombre es obligatorio.');
        if (Number(precio) <= 0) return setFormError('El precio debe ser mayor a cero.');
        if (Number(stock) < 0) return setFormError('El stock no puede ser negativo.');
        if (!categoriaId) return setFormError('Debes seleccionar una categoría.');
        if (!proveedorId) return setFormError('Debes seleccionar un proveedor.');

        setGuardando(true);
        try {
            const productoData = {
                nombre: nombre.trim(),
                descripcion: descripcion.trim(),
                precio: Number(precio),
                stock: Number(stock),
                imagenUrl: imagenUrl.trim(),
                categorias: { id: Number(categoriaId) },
                proveedor: { id: Number(proveedorId) }
            };

            if (editandoId) {
                // Actualizar producto existente
                await apiService.actualizarProducto(editandoId, productoData);
            } else {
                // Crear producto nuevo
                await apiService.crearProducto(productoData);
            }

            cancelarEdicion();
            await cargarDatos();
        } catch (e) {
            setFormError(e.message);
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
        try {
            await apiService.eliminarProducto(id);
            await cargarDatos();
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            {/* Formulario de Alta / Edición */}
            <form onSubmit={handleGuardar} className={`p-6 rounded-2xl border shadow-sm space-y-4 transition-colors ${editandoId ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <PackagePlus className={`w-5 h-5 ${editandoId ? 'text-amber-600' : 'text-indigo-600'}`} />
                        {editandoId ? `Editando Producto #${editandoId}` : 'Registrar Nuevo Producto'}
                    </h3>
                    {editandoId && (
                        <button
                            type="button"
                            onClick={cancelarEdicion}
                            className="text-xs font-bold text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
                        >
                            <X className="w-4 h-4" /> Cancelar Edición
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <input
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre del producto *"
                        className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    />
                    <input
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        type="number"
                        step="0.01"
                        placeholder="Precio (MXN) *"
                        className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    />
                    <input
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        type="number"
                        placeholder="Stock disponible *"
                        className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    />
                    <input
                        value={imagenUrl}
                        onChange={(e) => setImagenUrl(e.target.value)}
                        placeholder="URL de la imagen (Opcional)"
                        className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    />

                    <select
                        value={categoriaId}
                        onChange={(e) => setCategoriaId(e.target.value)}
                        className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                        <option value="">Selecciona una Categoría *</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>

                    <select
                        value={proveedorId}
                        onChange={(e) => setProveedorId(e.target.value)}
                        className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                        <option value="">Selecciona un Proveedor *</option>
                        {proveedores.map((prov) => (
                            <option key={prov.id} value={prov.id}>{prov.nombre || prov.nombreEmpresa}</option>
                        ))}
                    </select>
                </div>

                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción detallada del producto..."
                    rows="2"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />

                {formError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-xl flex items-center gap-2 text-sm border border-red-200">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{formError}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={guardando}
                    className={`font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all duration-200 disabled:opacity-50 cursor-pointer ${
                        editandoId 
                            ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                >
                    {guardando ? 'Guardando...' : editandoId ? 'Actualizar Producto' : 'Agregar Producto al Inventario'}
                </button>
            </form>

            {/* Tabla de Productos */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
                    <h3 className="font-bold text-gray-800">Inventario Actual</h3>
                    <button
                        onClick={cargarDatos}
                        className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                        <RefreshCw className="w-4 h-4" /> Recargar
                    </button>
                </div>

                {cargando ? (
                    <p className="px-6 py-8 text-center text-sm text-gray-500">Cargando inventario...</p>
                ) : error ? (
                    <p className="px-6 py-8 text-center text-sm text-red-600">Error: {error}</p>
                ) : productos.length === 0 ? (
                    <p className="px-6 py-8 text-center text-sm text-gray-500">No hay productos registrados todavía.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white border-b border-gray-200 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Nombre</th>
                                    <th className="p-4">Categoría</th>
                                    <th className="p-4">Precio</th>
                                    <th className="p-4">Stock</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {productos.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-400">#{p.id}</td>
                                        <td className="p-4 font-bold text-gray-800">{p.nombre}</td>
                                        <td className="p-4">
                                            <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-bold">
                                                {p.categorias?.nombre || 'Sin categoría'}
                                            </span>
                                        </td>
                                        <td className="p-4 font-semibold text-gray-700">${Number(p.precio).toFixed(2)} MXN</td>
                                        <td className="p-4 font-bold text-green-600">{p.stock}</td>
                                        <td className="p-4 text-right space-x-3">
                                            {/* Botón de Editar */}
                                            <button
                                                onClick={() => iniciarEdicion(p)}
                                                className="text-amber-600 hover:text-amber-800 font-medium text-xs inline-flex items-center gap-1 cursor-pointer"
                                            >
                                                <Edit3 className="w-4 h-4" /> Editar
                                            </button>
                                            {/* Botón de Eliminar */}
                                            <button
                                                onClick={() => handleEliminar(p.id)}
                                                className="text-red-500 hover:text-red-700 font-medium text-xs inline-flex items-center gap-1 cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" /> Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};