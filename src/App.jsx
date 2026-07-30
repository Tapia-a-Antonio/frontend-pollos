import { useState, useEffect } from 'react'
import Footer from './components/Footer.jsx';
import { Catalogo } from './components/Catalogo';
import { Navbar } from './components/Navbar';
import { apiService } from './services/apiService';
import { Registro } from './components/Registro'; 
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { CheckoutForm } from './components/CheckoutForm';
import { MisCompras } from './components/MisCompras';
import { PerfilUsuario } from './components/PerfilUsuario';

function App() {
    const [vistaActual, setVistaActual] = useState('catalogo');
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [ventaActiva, setVentaActiva] = useState(null);

    useEffect(() => {
        if(apiService.isAuthenticated()){
            setUser({
                username: localStorage.getItem('username'),
                nombre: localStorage.getItem('nombre'),
                rol: localStorage.getItem('rol')
            });
        }
    }, []);

    const handleLoginSucces = (userData) => {
        setUser({ username: userData.username, nombre: userData.nombre, rol: userData.rol });
        setVistaActual(userData.rol === 'ROLE_ADMIN' ? 'admin-dashboard' : 'catalogo');
    };

    const handleLogout = () => {
        apiService.logout();
        setUser(null);
        setCart([]);
        setVentaActiva(null);
        setVistaActual('catalogo');
    }

    // --- LÓGICA DEL CARRITO ---
    const addToCart = (producto) => {
        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.producto.id === producto.id);
            if (existing) {
                if (existing.cantidad >= producto.stock) {
                    alert('No hay suficiente stock disponible.');
                    return prevCart;
                }
                return prevCart.map((item) => 
                    item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            return [...prevCart, { producto: producto, cantidad: 1 }];
        });
        alert(`${producto.nombre} agregado al carrito`);
    };

    const cartCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

   const procesarCompra = async () => {
    if(cart.length === 0) return alert("El carrito está vacío");
    try {
        const total = cart.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
        
        // Mapeamos los artículos del carrito para que el backend los reciba como detalles
        const detallesVenta = cart.map(item => ({
            cantidad: item.cantidad,
            precioUnitario: item.producto.precio,
            subtotal: item.producto.precio * item.cantidad,
            producto: { id: item.producto.id }
        }));

        const nuevaVenta = await apiService.crearVenta({
                fecha: new Date().toISOString().split('T')[0],
                total: total,
                estadoPago: 'PENDIENTE',
                cliente: { email: user?.username },
                detalles: detallesVenta
            });
        
        setVentaActiva(nuevaVenta);
        setCart([]);
        setVistaActual('checkout');
    } catch (error) {
        alert("Error al procesar la venta: " + error.message);
    }
};

    const vistaContenido = () =>{
        switch(vistaActual){
            case 'perfil':
                return <PerfilUsuario user={user} />;
            case 'catalogo':
                return <Catalogo setVistaActual={setVistaActual} usuario={user} agregarACarrito={addToCart} />;
            case 'admin-dashboard':
                return <AdminDashboard setVistaActual={setVistaActual} user={user} />;
            case 'register':
                return <Registro onRegisterSuccess={() => setVistaActual('login')} onGoToLogin={() => setVistaActual('login')} onGoToCatalogo={() => setVistaActual('catalogo')}/>;
            case 'login':
                return <Login onLoginSuccess={handleLoginSucces} onGoToRegister={() => setVistaActual('register')}/>;
            case 'checkout':
                return <CheckoutForm ventaActiva={ventaActiva} setVistaActual={setVistaActual} />;
            case 'miscompras':
                return <MisCompras setVistaActual={setVistaActual} />;
            default:
                return <Catalogo setVistaActual={setVistaActual} usuario={user} agregarACarrito={addToCart} />;
        }
    };

    return (
        // Cambiamos bg-[#F9F8F3] por bg-slate-900 y text-gray-800 por text-slate-200 para que el texto base se lea en el fondo oscuro
        <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200 antialiased">
            <Navbar vistaActual={vistaActual} setVistaActual={setVistaActual} user={user} onLogout={handleLogout} cartCount={cartCount} openCart={procesarCompra} />
            <main className="flex-grow pb-12">
                {vistaContenido()}
            </main>
            <Footer/>
        </div>
    );
}
export default App;