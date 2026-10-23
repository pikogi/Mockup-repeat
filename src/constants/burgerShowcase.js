// Vitrina de ejemplo de una hamburguesería ficticia (Toro Burgers), para mostrarle
// a prospectos gastronómicos cómo se ve una vitrina con su rubro. Solo vista pública
// (/showcase-demo/burger): los datos son fijos, no se editan desde el admin.

const img = (id) => `https://images.unsplash.com/${id}?w=600&q=75`

const item = (fields) => ({
  price_type: 'single',
  price: null,
  variants: [],
  stock_enabled: false,
  stock: null,
  visible: true,
  ...fields,
})

export const BURGER_BRAND = {
  name: 'Toro Burgers',
  subtitle: 'Smash burgers a la plancha',
  color: '#f97316',
  logo_url: '/toro-burgers-logo.svg',
  banner_url: '',
}

export const BURGER_SHOWCASE = {
  id: 'burger',
  name: 'Menú',
  layout: 'gallery',
  categories: ['Hamburguesas', 'Combos', 'Para acompañar', 'Bebidas', 'Shakes', 'Postres'],
  items: [
    // ─── Hamburguesas ───
    item({
      id: 'toro-clasica',
      name: 'Toro Clásica',
      description: 'Medallón de 150 g, cheddar, lechuga, tomate, cebolla morada y salsa Toro en pan brioche.',
      image_url: img('photo-1571091718767-18b5b1457add'),
      category: 'Hamburguesas',
      price: 11500,
    }),
    item({
      id: 'smash',
      name: 'Smash Cheese',
      description: 'Medallones aplastados a la plancha, doble cheddar, pepinos y cebolla picada.',
      image_url: img('photo-1607013251379-e6eecfffe234'),
      category: 'Hamburguesas',
      price_type: 'variants',
      variants: [
        { id: 'simple', name: 'Simple', price: 10500 },
        { id: 'doble', name: 'Doble', price: 13500 },
        { id: 'triple', name: 'Triple', price: 16500 },
      ],
    }),
    item({
      id: 'doble-cheddar',
      name: 'Doble Cheddar',
      description: 'Dos medallones de 120 g, cuádruple cheddar, cebolla caramelizada y mayo ahumada.',
      image_url: img('photo-1568901346375-23c9450c58cd'),
      category: 'Hamburguesas',
      price: 14200,
    }),
    item({
      id: 'bacon-bbq',
      name: 'Bacon BBQ',
      description: 'Doble medallón, panceta crocante, cheddar, aros de cebolla y salsa barbacoa casera.',
      image_url: img('photo-1553979459-d2229ba7433b'),
      category: 'Hamburguesas',
      price: 15800,
    }),
    item({
      id: 'triple-toro',
      name: 'Triple Toro',
      description: 'Tres medallones, triple cheddar, panceta, pepinos y salsa Toro. Solo para valientes.',
      image_url: img('photo-1572802419224-296b0aeee0d9'),
      category: 'Hamburguesas',
      price: 18900,
    }),
    item({
      id: 'completa',
      name: 'La Completa',
      description: 'Medallón de 180 g, jamón, queso, huevo a la plancha, lechuga, tomate y mayo.',
      image_url: img('photo-1586190848861-99aa4a171e90'),
      category: 'Hamburguesas',
      price: 14900,
    }),
    item({
      id: 'guacamole',
      name: 'Guacamole Burger',
      description: 'Medallón de 150 g, guacamole, pico de gallo, cheddar y jalapeños.',
      image_url: img('photo-1520072959219-c595dc870360'),
      category: 'Hamburguesas',
      price: 14500,
      stock_enabled: true,
      stock: 0,
    }),
    item({
      id: 'crispy-chicken',
      name: 'Crispy Chicken',
      description: 'Pechuga de pollo rebozada y crocante, lechuga, tomate, pepinos y mayo picante.',
      image_url: img('photo-1615297928064-24977384d0da'),
      category: 'Hamburguesas',
      price: 13200,
    }),
    item({
      id: 'veggie',
      name: 'Veggie',
      description: 'Medallón de garbanzos y quinoa, queso tybo, rúcula, tomate y alioli de limón.',
      image_url: img('photo-1525059696034-4967a8e1dca2'),
      category: 'Hamburguesas',
      price: 12500,
    }),

    // ─── Combos ───
    item({
      id: 'combo-clasico',
      name: 'Combo Clásico',
      description: 'Toro Clásica + papas fritas + bebida a elección.',
      image_url: img('photo-1594212699903-ec8a3eca50f5'),
      category: 'Combos',
      price: 16900,
    }),
    item({
      id: 'combo-amigos',
      name: 'Combo para 2',
      description: '2 Smash Cheese dobles + papas grandes para compartir + 2 bebidas.',
      image_url: img('photo-1561758033-d89a9ad46330'),
      category: 'Combos',
      price: 34500,
    }),

    // ─── Para acompañar ───
    item({
      id: 'papas',
      name: 'Papas fritas',
      description: 'Papas bastón crocantes con sal marina.',
      image_url: img('photo-1630384060421-cb20d0e0649d'),
      category: 'Para acompañar',
      price_type: 'variants',
      variants: [
        { id: 'chica', name: 'Chicas', price: 4500 },
        { id: 'grandes', name: 'Grandes', price: 6500 },
      ],
    }),
    item({
      id: 'papas-cheddar',
      name: 'Papas cheddar y panceta',
      description: 'Papas fritas bañadas en salsa cheddar, panceta crocante y cebollín.',
      image_url: img('photo-1573080496219-bb080dd4f877'),
      category: 'Para acompañar',
      price: 8200,
    }),
    item({
      id: 'papas-rusticas',
      name: 'Papas rústicas',
      description: 'Con cáscara, romero y ajo. Vienen con alioli.',
      image_url: img('photo-1541592106381-b31e9677c0e5'),
      category: 'Para acompañar',
      price: 6900,
    }),
    item({
      id: 'aros',
      name: 'Aros de cebolla',
      description: '10 aros rebozados en cerveza con salsa barbacoa.',
      image_url: img('photo-1639024471283-03518883512d'),
      category: 'Para acompañar',
      price: 6800,
    }),
    item({
      id: 'chicken-fingers',
      name: 'Chicken fingers',
      description: '6 tiras de pollo crispy con salsa honey mustard.',
      image_url: img('photo-1562967914-608f82629710'),
      category: 'Para acompañar',
      price: 8900,
    }),

    // ─── Bebidas ───
    item({
      id: 'limonada',
      name: 'Limonada casera',
      description: 'Limón exprimido, menta y jengibre. Jarra de 500 ml.',
      image_url: img('photo-1621263764928-df1444c5e859'),
      category: 'Bebidas',
      price: 4200,
    }),
    item({
      id: 'limonada-frutos',
      name: 'Limonada de frutos rojos',
      description: 'Frutillas, frambuesas y limón con hielo. 500 ml.',
      image_url: img('photo-1497534446932-c925b458314e'),
      category: 'Bebidas',
      price: 4800,
    }),
    item({
      id: 'jugo-naranja',
      name: 'Jugo de naranja',
      description: 'Exprimido en el momento. 400 ml.',
      image_url: img('photo-1600271886742-f049cd451bba'),
      category: 'Bebidas',
      price: 3900,
    }),
    item({
      id: 'cerveza',
      name: 'Cerveza rubia tirada',
      description: 'Golden ale artesanal, bien fría.',
      image_url: img('photo-1608270586620-248524c67de9'),
      category: 'Bebidas',
      price_type: 'variants',
      variants: [
        { id: 'media', name: 'Media pinta', price: 3800 },
        { id: 'pinta', name: 'Pinta', price: 5500 },
      ],
    }),
    item({
      id: 'ipa',
      name: 'Pinta IPA',
      description: 'Lupulada y aromática, con notas cítricas.',
      image_url: img('photo-1535958636474-b021ee887b13'),
      category: 'Bebidas',
      price: 6200,
    }),
    item({
      id: 'agua',
      name: 'Agua mineral',
      description: 'Con o sin gas. 500 ml.',
      image_url: img('photo-1548839140-29a749e1cf4d'),
      category: 'Bebidas',
      price: 2500,
    }),

    // ─── Shakes ───
    item({
      id: 'shake-cookies',
      name: 'Shake cookies & cream',
      description: 'Helado de vainilla, galletitas de chocolate trituradas y crema batida.',
      image_url: img('photo-1572490122747-3968b75cc699'),
      category: 'Shakes',
      price: 6900,
    }),
    item({
      id: 'shake-chocolate',
      name: 'Shake de chocolate',
      description: 'Helado de chocolate amargo, salsa de chocolate y crema batida.',
      image_url: img('photo-1577805947697-89e18249d767'),
      category: 'Shakes',
      price: 6900,
    }),

    // ─── Postres ───
    item({
      id: 'brownie',
      name: 'Brownie con helado',
      description: 'Brownie tibio con nueces y una bocha de helado de vainilla.',
      image_url: img('photo-1606313564200-e75d5e30476c'),
      category: 'Postres',
      price: 5900,
    }),
    item({
      id: 'donas',
      name: 'Donas glaseadas x2',
      description: 'Glaseado de chocolate y chips de colores.',
      image_url: img('photo-1551024601-bec78aea704b'),
      category: 'Postres',
      price: 4500,
    }),
  ],
}
