import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Inventario } from './Inventario';
import { AdminCategorias } from './AdminCategorias';
import { AdminVentas } from './AdminVentas';
import { LayoutDashboard } from 'lucide-react';
import { AdminProveedores } from './AdminProveedores';

export const AdminDashboard = ({ setVistaActual, user }) => {
    const [activeTab, setActiveTab] = useState('inventario');

    const renderContent = () => {
        switch (activeTab) {
            case 'inventario':
                return <Inventario />;
            case 'categorias':
                return <AdminCategorias />;
            case 'ventas':
                return <AdminVentas />;
            case 'proveedores':
                return <AdminProveedores />;
            case 'dashboard':
            default:
                return (
                    <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center shadow-lg flex flex-col items-center justify-center mt-4">
                        <LayoutDashboard className="w-16 h-16 text-indigo-300 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800">¡Bienvenido al Panel Administrativo!</h3>
                        <p className="text-gray-500 mt-2 text-lg">Selecciona una opción del menú lateral para gestionar tu tienda.</p>
                    </div>
                );
        }
    };

    return (
        // Calculamos el alto de la pantalla menos el Navbar para que encaje perfecto
        <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="flex-1 overflow-y-auto p-8">
                {/* Banner estilo Catálogo */}
                <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 rounded-2xl shadow-lg p-8 mb-8 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight">Panel de Administración</h2>
                        <p className="text-indigo-200 text-sm mt-2">
                            Gestiona tu inventario, categorías y ventas. Usuario activo: <span className="font-bold text-white">{user?.nombre}</span>
                        </p>
                    </div>
                    <div className="hidden sm:block opacity-20">
                        <LayoutDashboard className="w-20 h-20" />
                    </div>
                </div>
                
                <div className="animate-fade-in">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};