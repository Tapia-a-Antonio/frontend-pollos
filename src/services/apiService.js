// URL de tu backend en Spring Boot
const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/`;

// Cabeceras con el token JWT (si hay sesión). Pasa json=true cuando envías un cuerpo JSON.
// Esto es más flexible que forzar siempre el 'application/json' (útil si luego subes imágenes)
const authHeaders = (json = false) => {
    const headers = json ? { 'Content-Type': 'application/json' } : {};
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

// Cabeceras para endpoints públicos que envían JSON (login / registro).
const JSON_HEADERS = { 'Content-Type': 'application/json' };

// Método avanzado para manejo de errores de la API
const handleResponse = async (response) => {
    if (!response.ok) {
        // 401 = sin token o token expirado -> avisamos al front para que cierre sesión automáticamente
        if (response.status === 401) {
            window.dispatchEvent(new CustomEvent('sesion-expirada'));
        }

        // Intenta extraer los errores limpios de Spring Boot en lugar de tronar con texto incomprensible
        const texto = await response.text();
        let mensaje = 'Error en la red';
        if (texto) {
            try {
                const data = JSON.parse(texto);
                mensaje = data.message || data.error || texto;
                // Si tienes validaciones (@Valid) en el backend, extrae los detalles
                if (data.errores) {
                    const detalles = Object.values(data.errores).join(' · ');
                    if (detalles) mensaje += `: ${detalles}`;
                }
            } catch {
                mensaje = texto; // Si no era JSON, mostramos el texto crudo
            }
        }
        throw new Error(mensaje);
    }
    if (response.status === 204) return null; // Para respuestas sin contenido (como DELETE)
    return await response.json();
};

export const apiService = {

    // ==========================================
    // ESTADOS Y UTILIDADES DEL USUARIO
    // ==========================================
    isAuthenticated: () => !!localStorage.getItem('token'),
    getToken: () => localStorage.getItem('token'),
    getUserRole: () => localStorage.getItem('rol'), // Guardado como 'rol' en tu login
    getUserName: () => localStorage.getItem('nombre') || localStorage.getItem('username'),

    // ==========================================
    // AUTENTICACIÓN (LOGIN Y REGISTRO)
    // ==========================================
    registro: async (userData) => {
        const response = await fetch(API_URL + 'auth/registro', {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify(userData),
        });
        return await handleResponse(response);
    },

    login: async (username, password) => {
        const response = await fetch(API_URL + 'auth/login', {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ username, password })
        });
        const data = await handleResponse(response);
        if (data && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username ?? '');
            localStorage.setItem('nombre', data.nombre ?? '');
            localStorage.setItem('rol', data.rol ?? ''); 
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('nombre');
        localStorage.removeItem('rol');
    },

    actualizarPerfilUsuario: async (username, nombre) => {
        const response = await fetch(API_URL + 'auth/actualizar-perfil', {
            method: 'PUT',
            headers: authHeaders(true),
            body: JSON.stringify({ username, nombre })
        });
        return await handleResponse(response);
    },

    cambiarPassword: async (username, actual, nueva) => {
        const response = await fetch(API_URL + 'auth/cambiar-password', {
            method: 'POST',
            headers: authHeaders(true),
            body: JSON.stringify({ username, actual, nueva })
        });
        return await handleResponse(response);
    },

    // ==========================================
    // PRODUCTOS
    // ==========================================
    getProductos: async () => {
        const response  = await fetch(API_URL + "productos", { headers: authHeaders() });
        return await handleResponse(response);
    },
    getProductoPorId: async (id) => {
        const response  = await fetch(`${API_URL}productos/${id}`, { headers: authHeaders() });
        return await handleResponse(response);
    },
    crearProducto: async (producto) => {
        const response = await fetch(API_URL + "productos", {
            method: 'POST',
            headers: authHeaders(true),
            body: JSON.stringify(producto),
        });
        return await handleResponse(response);
    },
    actualizarProducto: async (id, producto) => {
        const response = await fetch(`${API_URL}productos/${id}`, {
            method: 'PUT',
            headers: authHeaders(true),
            body: JSON.stringify(producto),
        });
        return await handleResponse(response);
    },
    eliminarProducto: async (id) => {
        const response = await fetch(`${API_URL}productos/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        return await handleResponse(response);
    },

    // ==========================================
    // CATEGORÍAS
    // ==========================================
    getCategorias: async () => {
        const response = await fetch(API_URL + "categorias", { headers: authHeaders() });
        return await handleResponse(response);
    },
    getCategoriaPorId: async (id) => {
        const response = await fetch(`${API_URL}categorias/${id}`, { headers: authHeaders() });
        return await handleResponse(response);
    },
    crearCategoria: async (categoria) => {
        const response = await fetch(API_URL + "categorias", {
            method: 'POST',
            headers: authHeaders(true),
            body: JSON.stringify(categoria),
        });
        return await handleResponse(response);
    },
    actualizarCategoria: async (id, categoria) => {
        const response = await fetch(`${API_URL}categorias/${id}`, {
            method: 'PUT',
            headers: authHeaders(true),
            body: JSON.stringify(categoria),
        });
        return await handleResponse(response);
    },
    eliminarCategoria: async (id) => {
        const response = await fetch(`${API_URL}categorias/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        return await handleResponse(response);
    },

    // ==========================================
    // CLIENTES
    // ==========================================
    getClientes: async () => {
        const response = await fetch(API_URL + "clientes", { headers: authHeaders() });
        return await handleResponse(response);
    },
    getClientePorId: async (id) => {
        const response = await fetch(`${API_URL}clientes/${id}`, { headers: authHeaders() });
        return await handleResponse(response);
    },
    crearCliente: async (cliente) => {
        const response = await fetch(API_URL + "clientes", {
            method: 'POST',
            headers: authHeaders(true),
            body: JSON.stringify(cliente),
        });
        return await handleResponse(response);
    },
    actualizarCliente: async (id, cliente) => {
        const response = await fetch(`${API_URL}clientes/${id}`, {
            method: 'PUT',
            headers: authHeaders(true),
            body: JSON.stringify(cliente),
        });
        return await handleResponse(response);
    },
    eliminarCliente: async (id) => {
        const response = await fetch(`${API_URL}clientes/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        return await handleResponse(response);
    },

    // ==========================================
    // PROVEEDORES
    // ==========================================
    getProveedores: async () => {
        const response = await fetch(API_URL + "proveedor", { headers: authHeaders() });
        return await handleResponse(response);
    },
    getProveedorPorId: async (id) => {
        const response = await fetch(`${API_URL}proveedor/${id}`, { headers: authHeaders() });
        return await handleResponse(response);
    },
    crearProveedor: async (proveedor) => {
        const response = await fetch(API_URL + "proveedor", {
            method: 'POST',
            headers: authHeaders(true),
            body: JSON.stringify(proveedor),
        });
        return await handleResponse(response);
    },
    actualizarProveedor: async (id, proveedor) => {
        const response = await fetch(`${API_URL}proveedor/${id}`, {
            method: 'PUT',
            headers: authHeaders(true),
            body: JSON.stringify(proveedor),
        });
        return await handleResponse(response);
    },
    eliminarProveedor: async (id) => {
        const response = await fetch(`${API_URL}proveedor/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        return await handleResponse(response);
    },

    // ==========================================
    // VENTAS
    // ==========================================
    getVentas: async () => {
        const response = await fetch(API_URL + "ventas", { headers: authHeaders() });
        return await handleResponse(response);
    },
    getVentaPorId: async (id) => {
        const response = await fetch(`${API_URL}ventas/${id}`, { headers: authHeaders() });
        return await handleResponse(response);
    },
    crearVenta: async (venta) => {
        const response = await fetch(API_URL + "ventas", {
            method: 'POST',
            headers: authHeaders(true),
            body: JSON.stringify(venta),
        });
        return await handleResponse(response);
    },
    actualizarVenta: async (id, venta) => {
        const response = await fetch(`${API_URL}ventas/${id}`, {
            method: 'PUT',
            headers: authHeaders(true),
            body: JSON.stringify(venta),
        });
        return await handleResponse(response);
    },
    procesarVenta: async (venta) => {
        const response = await fetch(API_URL + "ventas/procesar", {
            method: 'POST',
            headers: authHeaders(true),
            body: JSON.stringify(venta),
        });
        return await handleResponse(response);
    },

    // ==========================================
    // PAGOS (Opcional si lo vas a usar luego)
    // ==========================================
    getPagos: async () => {
        const response = await fetch(API_URL + "pagos", { headers: authHeaders() });
        return await handleResponse(response);
    },
    getPagoPorId: async (id) => {
        const response = await fetch(`${API_URL}pagos/${id}`, { headers: authHeaders() });
        return await handleResponse(response);
    },
    crearPago: async (pago) => {
        const response = await fetch(API_URL + "pagos", {
            method: 'POST',
            headers: authHeaders(true),
            body: JSON.stringify(pago),
        });
        return await handleResponse(response);
    },
    actualizarPago: async (id, pago) => {
        const response = await fetch(`${API_URL}pagos/${id}`, {
            method: 'PUT',
            headers: authHeaders(true),
            body: JSON.stringify(pago),
        });
        return await handleResponse(response);
    },
    eliminarPago: async (id) => {
        const response = await fetch(`${API_URL}pagos/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        return await handleResponse(response);
    }
};