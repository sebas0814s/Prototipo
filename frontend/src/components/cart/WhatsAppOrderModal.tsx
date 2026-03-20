import { useState, useRef, useEffect } from 'react';
import { X, MessageCircle, User, Phone, MapPin, Home, FileText } from 'lucide-react';
import { CustomerInfo } from '../../services/whatsapp';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (info: CustomerInfo) => void;
  isLoading: boolean;
}

const WA_ICON = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function WhatsAppOrderModal({ isOpen, onClose, onConfirm, isLoading }: Props) {
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [city,    setCity]    = useState('');
  const [address, setAddress] = useState('');
  const [notes,   setNotes]   = useState('');
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => nameRef.current?.focus(), 100);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim())  e.name  = 'El nombre es requerido';
    if (!phone.trim()) e.phone = 'El teléfono es requerido';
    if (!city.trim())  e.city  = 'La ciudad es requerida';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onConfirm({ name: name.trim(), phone: phone.trim(), city: city.trim(), address: address.trim() || undefined, notes: notes.trim() || undefined });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">

        {/* Header verde WhatsApp */}
        <div className="bg-[#075E54] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <WA_ICON />
            </div>
            <div>
              <p className="font-bold text-sm leading-none">Confirmar pedido</p>
              <p className="text-white/70 text-xs mt-0.5">Se abrirá WhatsApp con tu pedido listo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Nombre */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 mb-1.5">
              <User size={13} /> Nombre completo <span className="text-rose-400">*</span>
            </label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. María López"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors
                ${errors.name ? 'border-red-400 bg-red-50' : 'border-stone-200 focus:border-green-400'}`}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Teléfono */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 mb-1.5">
              <Phone size={13} /> Teléfono / WhatsApp <span className="text-rose-400">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej. 300 123 4567"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors
                ${errors.phone ? 'border-red-400 bg-red-50' : 'border-stone-200 focus:border-green-400'}`}
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Ciudad */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 mb-1.5">
              <MapPin size={13} /> Ciudad <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ej. Medellín, Bogotá, Cali…"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors
                ${errors.city ? 'border-red-400 bg-red-50' : 'border-stone-200 focus:border-green-400'}`}
            />
            {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
          </div>

          {/* Dirección (opcional) */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 mb-1.5">
              <Home size={13} /> Dirección <span className="text-stone-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle, barrio, local…"
              className="w-full border border-stone-200 focus:border-green-400 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 mb-1.5">
              <FileText size={13} /> Notas adicionales <span className="text-stone-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Color especial, medidas personalizadas, fecha de entrega deseada…"
              rows={2}
              className="w-full border border-stone-200 focus:border-green-400 rounded-xl px-4 py-2.5 text-sm outline-none resize-none transition-colors"
            />
          </div>

          {/* Aviso */}
          <p className="text-xs text-stone-400 bg-stone-50 rounded-xl px-4 py-3 leading-relaxed">
            Al confirmar se abrirá WhatsApp con un mensaje listo con tus productos. Nuestro equipo te responderá para coordinar el pago y la entrega. 🛍️
          </p>
        </div>

        {/* Acciones */}
        <div className="px-6 pb-6 pt-2 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-stone-200 text-stone-500 font-medium text-sm py-3 rounded-xl hover:bg-stone-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <MessageCircle size={16} />
                Abrir WhatsApp
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
