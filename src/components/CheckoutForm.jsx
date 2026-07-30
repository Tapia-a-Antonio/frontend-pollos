import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiService } from '../services/apiService';
import { CreditCard, CheckCircle2, ShieldAlert, Loader2, Play } from 'lucide-react';

// Llave pública de prueba de Stripe
const stripePromise = loadStripe('pk_test_51PlaceholderPublishableKeyHere000000000000000000000000000000000000000000000000000000000');

const PaymentForm = ({ venta, onPaymentSuccess, setVistaActual }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getSecret = async () => {
      try {
        const res = await apiService.crearPago({ 
            idVenta: venta.id, 
            monto: venta.total, 
            metodo: 'tarjeta',
            referencia: 'TEST-' + venta.id
        });
        // En un entorno real, tu backend devolvería el clientSecret aquí.
        // Como tu backend actual guarda el pago directamente, simularemos el éxito si no hay error.
      } catch (err) {
        console.warn('Usando simulador local.');
      }
    };
    if (venta && venta.id) getSecret();
  }, [venta]);

  const handleSimulatePayment = async () => {
  setProcesando(true);
  try {
    // Reemplazamos localhost por tu variable de entorno VITE_API_URL
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/pagos/confirmar-pago/${venta.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiService.getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error("No se pudo confirmar el pago en el servidor.");
    }

    onPaymentSuccess();
  } catch (err) {
    setError(err.message || 'Error al conectar con la API.');
  } finally {
    setProcesando(false);
  }
};

  return (
    <div className="space-y-6">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
        <h4 className="text-sm font-bold text-amber-800">Modo de Pruebas</h4>
        <button
          type="button"
          onClick={handleSimulatePayment}
          disabled={procesando}
          className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          {procesando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Simular Pago Exitoso
        </button>
      </div>
    </div>
  );
};

export const CheckoutForm = ({ ventaActiva, setVistaActual }) => {
  const [pagado, setPagado] = useState(false);

  if (!ventaActiva) return <div>No hay venta activa. Regresa al catálogo.</div>;

  if (pagado) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl p-8 text-center shadow-xl">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-black mt-4">¡Pago Exitoso!</h2>
        <button onClick={() => setVistaActual('catalogo')} className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-xl font-bold">
          Seguir Comprando
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-indigo-900 px-6 py-6 text-white text-center">
        <h2 className="text-xl font-bold">Checkout de Venta #{ventaActiva.id}</h2>
        <p>Total a pagar: ${ventaActiva.total} MXN</p>
      </div>
      <div className="p-6">
        <Elements stripe={stripePromise}>
          <PaymentForm venta={ventaActiva} onPaymentSuccess={() => setPagado(true)} setVistaActual={setVistaActual} />
        </Elements>
      </div>
    </div>
  );
};