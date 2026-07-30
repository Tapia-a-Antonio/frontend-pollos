import { LayoutDashboard, Package, Tags, CreditCard, Truck, Settings } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'inventario', label: 'Productos', icon: Package },
        { id: 'categorias', label: 'Categorías', icon: Tags },
        { id: 'proveedores', label: 'Proveedores', icon: Truck }, // <-- Nuevo ítem
        { id: 'ventas', label: 'Ventas', icon: CreditCard }
    ];

    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Settings className="w-4 h-4 text-indigo-500" /> Menú Admin
            </h3>
            <div className="flex flex-col gap-1.5">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                                isActive 
                                    ? 'bg-indigo-50 text-indigo-700 font-bold' 
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                            {item.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};