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
        <nav className="sticky top-0 z-50 bg-indigo-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo y links */}
                    <div className="flex items-center cursor-pointer"
                        onClick={() => setVistaActual('catalogo')}>
                        <ShoppingBag className="h-8 w-8 text-indigo-400 animate-pluse" />
                        <span className="font-extrabold text-xl tracking-tight 
                    bg-gradient-to-r from-indigo-200 via-indigo-400 to-white bg-clip-text 
                    text-transparent">Mercadito Libre</span>
                    </div>
                    {/* Links de navegación */}
                    <div className="flex items-centers space-x-4">
                        <button onClick={() => setVistaActual('catalogo')}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all 
                    duration-200 hover:bg-indigo-800 
                    ${vistaActual === 'catalogo' ?
                                    'bg-indigo-800 font-bold border-b-2 border-indigo-400' : ''}`}>
                            Catalogo
                        </button>

                        {/*Botones para clientes*/}
                        {isClient && (
                            <button
                                onClick={() => setVistaActual('miscompras')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-indigo-800 ${vistaActual === 'miscompras' ? 'bg-indigo-800 font-bold border-b-2 border-indigo-400' : ''}`}
                            >
                                <ListOrdered className="w-4 h-4" />
                                Mis Compras
                            </button>
                        )}

                        {/*Botones para admin*/}
                        {isAdmin && (
                            <button
                                onClick={() => setVistaActual('admin-dashboard')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-indigo-800 ${vistaActual === 'admin-dashboard' ? 'bg-indigo-800 font-bold border-b-2 border-indigo-400' : ''}`}
                            >
                                <ListOrdered className="w-4 h-4" />
                                Admin Panel
                            </button>
                        )}

                        {/* Botón de carrito y loggeo */}
                        {user ? (<>
                            <div className="flex items-center text-sm font-medium 
                            bg-indigo-800 px-3 py-1.5 rounded-full 
                            border border-indigo-600 gap-1.5 max-w-[150px] truncate">
                                <User className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                                <span className="truncate">{user.nombre}</span>
                            </div>

                            {isClient && (
                                <button onClick={openCart}
                                    className="relative p-2 rounded-full hover:bg-indigo-800 
                            transition-colors cursor-pointer group">
                                    <ShoppingCart className="w-6 h-6 text-white group-hover:text-indigo-300" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 
                                        text-white rounded-full text-xs w-5 h-5 
                                        flex items-center justify-center font-bold border
                                         border-indigo-900 animate-bounce">
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
                        transition-colors hover:bg-indigo-300">
                                Iniciar Sesión
                            </button>
                            <button onClick={() => setVistaActual('register')}
                                className="bg-indigo-500 hover:bg-ingido-600
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