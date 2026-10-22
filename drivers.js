// EDITA ESTE ARCHIVO para agregar o modificar clientes.
// El id debe ser único, corto, sin espacios ni acentos.
window.DRIVERS = [
  {
    id: 'carlos', name: 'Carlos Martínez', role: 'Chofer turístico',
    company: 'Carlos Private Transfers', location: 'Punta Cana, República Dominicana',
    whatsapp: '18095550101', // EJEMPLO: sustituir por número real con código de país
    phone: '+1 (809) 555-0101',
    photo: '', // URL pública de foto, o ruta local: images/carlos.jpg
    cover: '', // URL pública o ruta local: images/vehiculo-carlos.jpg
    description: {es:'Transporte privado y experiencias inolvidables en Punta Cana. Atención personalizada y reservas directas.',en:'Private transfers and unforgettable experiences in Punta Cana. Personalized service and direct bookings.'},
    services: [
      {es:'Traslados al aeropuerto',en:'Airport transfers', icon:'✈️'},
      {es:'Transporte privado',en:'Private transportation',icon:'🚙'},
      {es:'Excursiones',en:'Excursions',icon:'🏝️'}
    ]
  },
  {
    id: 'juan', name: 'Juan Pérez', role: 'Vendedor de excursiones',
    company: 'Juan Tours', location: 'Bávaro, República Dominicana',
    whatsapp: '18095550102', phone: '+1 (809) 555-0102', photo:'',cover:'',
    description:{es:'Descubre las mejores excursiones y actividades de la zona con atención directa.',en:'Discover the best local excursions and activities with direct assistance.'},
    services:[{es:'Isla Saona',en:'Saona Island',icon:'🏖️'},{es:'Aventuras',en:'Adventures',icon:'🌴'}]
  }
];
