import React from 'react';
import { apiService } from '../services/apiService';
import {
    ShoppingCart, LogOut, User, LayoutDashboard,
    Database, ListOrdered, ShoppingBag
} from 'lucide-react';

export const Navbar = ({ vistaActual, setVistaActual, user,
    onLogout, cartCount, openCart }) => {
    
    const handleLogout = () => {
        apiService.logout();
        onLogout();
        setVistaActual('catalogo');
    };

    const isClient = user && user.rol === 'ROLE_CLIENTE';
    const isAdmin = user && user.rol === 'ROLE_ADMIN';
    
    return (
        <nav className="sticky top-0 z-50 bg-blue-950 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo y links */}
                    <div className="flex items-center cursor-pointer"
                        onClick={() => setVistaActual('catalogo')}>
                        <ShoppingBag className="h-8 w-8 text-blue-400 mr-2 animate-pulse" />
                        <span className="font-extrabold text-2xl tracking-tight text-white">
                            CellMarket
                        </span>
                    </div>
                    
                    {/* Links de navegación */}
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setVistaActual('catalogo')}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all 
                    duration-200 hover:bg-blue-900 
                    ${vistaActual === 'catalogo' ?
                                    'bg-blue-900 font-bold border-b-2 border-blue-400' : ''}`}>
                            Catálogo
                        </button>

                        {/*Botones para clientes*/}
                        {isClient && (
                            <button
                                onClick={() => setVistaActual('miscompras')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-blue-900 ${vistaActual === 'miscompras' ? 'bg-blue-900 font-bold border-b-2 border-blue-400' : ''}`}
                            >
                                <ListOrdered className="w-4 h-4" />
                                Mis Compras
                            </button>
                        )}

                        {/*Botones para admin*/}
                        {isAdmin && (
                            <button
                                onClick={() => setVistaActual('admin-dashboard')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-blue-900 ${vistaActual === 'admin-dashboard' ? 'bg-blue-900 font-bold border-b-2 border-blue-400' : ''}`}
                            >
                                <ListOrdered className="w-4 h-4" />
                                Admin Panel
                            </button>
                        )}

                        {/* Botón de carrito y loggeo */}
                        {user ? (<>
                            <button
                                onClick={() => setVistaActual('perfil')}
                                title="Ver mi perfil"
                                className="flex items-center text-sm font-medium bg-blue-900 px-3 py-1.5 rounded-full border border-blue-700 gap-1.5 max-w-[150px] truncate hover:bg-blue-800 transition-colors cursor-pointer"
                            >
                                <User className="w-4 h-4 text-blue-300 flex-shrink-0" />
                                <span className="truncate">{user.nombre}</span>
                            </button>

                            {isClient && (
                                <button onClick={openCart}
                                    className="relative p-2 rounded-full hover:bg-blue-900 
                            transition-colors cursor-pointer group">
                                    <ShoppingCart className="w-6 h-6 text-white group-hover:text-blue-300" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 
                                        text-white rounded-full text-xs w-5 h-5 
                                        flex items-center justify-center font-bold border
                                         border-blue-900 animate-bounce">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-full hover:bg-red-900 hover:text-red-200 
                            transition-colors cursor-pointer"
                                title="Cerrar Sesión">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </>
                        ) : (<>
                            <button onClick={() => setVistaActual('login')}
                                className="px-3 py-2 rounded-md text-sm font-medium
                        transition-colors hover:bg-blue-800">
                                Iniciar Sesión
                            </button>
                            <button onClick={() => setVistaActual('register')}
                                className="bg-blue-600 hover:bg-blue-500
                        text-white px-4 py-2 rounded-md text-sm font-medium
                        transition-colors shadow-md">
                                Registrarse
                            </button>
                        </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};