import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el Seeding...');

  // 1. Usuarios para cada Rol
  const passwordHash = await bcrypt.hash('admin123', 10);

  const users = [
    {
      name: 'Admin',
      email: 'admin@newera.com',
      password: passwordHash,
      phone: '3000000000',
      role: 'ADMIN',
    },
    {
      name: 'Juan',
      email: 'customer@newera.com',
      password: passwordHash,
      phone: '3000000001',
      role: 'CUSTOMER',
    },
    {
      name: 'Brian',
      email: 'deliverer@newera.com',
      password: passwordHash,
      phone: '3000000002',
      role: 'DELIVERER',
    },
    {
      name: 'Cajero',
      email: 'cashier@newera.com',
      password: passwordHash,
      phone: '3000000003',
      role: 'CASHIER',
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  console.log('Usuarios verificados: ADMIN, CUSTOMER, DELIVERER, CASHIER (Contraseña: admin123)');

  // 2. Mapeo de Categorías y Productos
  const datosSemilla = [
    {
      categoria: 'Abarrotes',
      productos: [
        { name: 'Arroz Blanco 1kg', price: 1.40, stock: 150, description: 'Arroz de grano largo premium', imageUrl: 'https://picsum.photos/200?random=1' },
        { name: 'Aceite de Oliva Extra Virgen 500ml', price: 7.90, stock: 40, description: 'Aceite prensado en frío', imageUrl: 'https://picsum.photos/200?random=2' },
        { name: 'Frijol Rojo 500g', price: 1.80, stock: 80, description: 'Frijol rojo de calidad', imageUrl: 'https://picsum.photos/200?random=3' },
        { name: 'Lentejas 500g', price: 1.50, stock: 90, description: 'Lentejas ricas en hierro', imageUrl: 'https://picsum.photos/200?random=4' },
        { name: 'Azúcar Blanca 1kg', price: 1.20, stock: 120, description: 'Azúcar refinada', imageUrl: 'https://picsum.photos/200?random=5' },
        { name: 'Azúcar Morena 1kg', price: 1.30, stock: 100, description: 'Azúcar sin refinar', imageUrl: 'https://picsum.photos/200?random=6' },
        { name: 'Sal de Mar 500g', price: 0.80, stock: 200, description: 'Sal gruesa de mar', imageUrl: 'https://picsum.photos/200?random=7' },
        { name: 'Harina de Trigo 1kg', price: 1.10, stock: 150, description: 'Harina multiusos', imageUrl: 'https://picsum.photos/200?random=8' },
        { name: 'Café Molido 250g', price: 4.50, stock: 60, description: 'Café tostado y molido', imageUrl: 'https://picsum.photos/200?random=9' },
        { name: 'Sopa Instantánea de Pollo', price: 0.90, stock: 150, description: 'Fideos con sabor a pollo', imageUrl: 'https://picsum.photos/200?random=10' }
      ]
    },
    {
      categoria: 'Bebidas',
      productos: [
        { name: 'Agua Mineral 500ml', price: 0.80, stock: 200, description: 'Agua mineral sin gas', imageUrl: 'https://picsum.photos/200?random=11' },
        { name: 'Agua con Gas 500ml', price: 0.90, stock: 150, description: 'Agua purificada gasificada', imageUrl: 'https://picsum.photos/200?random=12' },
        { name: 'Jugo de Naranja 1L', price: 2.50, stock: 45, description: 'Jugo 100% natural', imageUrl: 'https://picsum.photos/200?random=13' },
        { name: 'Gaseosa de Cola 2L', price: 2.00, stock: 120, description: 'Bebida carbonatada clásica', imageUrl: 'https://picsum.photos/200?random=14' },
        { name: 'Gaseosa de Limón 2L', price: 1.90, stock: 110, description: 'Bebida carbonatada sabor limón', imageUrl: 'https://picsum.photos/200?random=15' },
        { name: 'Té Helado de Durazno 500ml', price: 1.20, stock: 80, description: 'Té negro con durazno', imageUrl: 'https://picsum.photos/200?random=16' },
        { name: 'Té Helado de Limón 500ml', price: 1.20, stock: 85, description: 'Té negro con limón', imageUrl: 'https://picsum.photos/200?random=17' },
        { name: 'Cerveza Lager 330ml', price: 1.50, stock: 200, description: 'Cerveza clara', imageUrl: 'https://picsum.photos/200?random=18' },
        { name: 'Cerveza Stout 330ml', price: 1.80, stock: 100, description: 'Cerveza oscura', imageUrl: 'https://picsum.photos/200?random=19' },
        { name: 'Vino Tinto Cabernet 750ml', price: 8.50, stock: 40, description: 'Vino de la casa', imageUrl: 'https://picsum.photos/200?random=20' }
      ]
    },
    {
      categoria: 'Bebés',
      productos: [
        { name: 'Pañales Talla M (40 un)', price: 12.00, stock: 60, description: 'Pañales para bebé', imageUrl: 'https://picsum.photos/200?random=21' },
        { name: 'Pañales Talla L (40 un)', price: 14.00, stock: 55, description: 'Pañales súper absorbentes', imageUrl: 'https://picsum.photos/200?random=22' },
        { name: 'Toallitas Húmedas (80 un)', price: 3.50, stock: 100, description: 'Toallitas con aloe vera', imageUrl: 'https://picsum.photos/200?random=23' },
        { name: 'Crema Anti-rozaduras', price: 5.00, stock: 40, description: 'Protección para la piel del bebé', imageUrl: 'https://picsum.photos/200?random=24' },
        { name: 'Shampoo para Bebé 200ml', price: 4.20, stock: 50, description: 'Fórmula sin lágrimas', imageUrl: 'https://picsum.photos/200?random=25' },
        { name: 'Jabón Líquido para Bebé', price: 3.80, stock: 60, description: 'Jabón suave e hipoalergénico', imageUrl: 'https://picsum.photos/200?random=26' },
        { name: 'Leche de Fórmula Etapa 1', price: 15.50, stock: 30, description: 'Fórmula infantil 0-6 meses', imageUrl: 'https://picsum.photos/200?random=27' },
        { name: 'Leche de Fórmula Etapa 2', price: 15.50, stock: 30, description: 'Fórmula infantil 6-12 meses', imageUrl: 'https://picsum.photos/200?random=28' },
        { name: 'Papilla de Manzana 113g', price: 1.50, stock: 80, description: 'Puré de frutas natural', imageUrl: 'https://picsum.photos/200?random=29' },
        { name: 'Papilla de Pera 113g', price: 1.50, stock: 80, description: 'Puré sin azúcar añadida', imageUrl: 'https://picsum.photos/200?random=30' }
      ]
    },
    {
      categoria: 'Carnes',
      productos: [
        { name: 'Pechuga de Pollo 1kg', price: 6.00, stock: 40, description: 'Pechuga limpia y fileteada', imageUrl: 'https://picsum.photos/200?random=31' },
        { name: 'Muslos de Pollo 1kg', price: 4.50, stock: 50, description: 'Muslos frescos', imageUrl: 'https://picsum.photos/200?random=32' },
        { name: 'Alitas de Pollo 1kg', price: 5.00, stock: 45, description: 'Alitas para asar o freír', imageUrl: 'https://picsum.photos/200?random=33' },
        { name: 'Carne Molida de Res 1kg', price: 8.50, stock: 25, description: 'Carne de res premium 90/10', imageUrl: 'https://picsum.photos/200?random=34' },
        { name: 'Bistec de Res 1kg', price: 9.50, stock: 30, description: 'Cortes finos de res', imageUrl: 'https://picsum.photos/200?random=35' },
        { name: 'Costillas de Cerdo 1kg', price: 7.50, stock: 20, description: 'Costillas carnosas', imageUrl: 'https://picsum.photos/200?random=36' },
        { name: 'Chuleta de Cerdo 1kg', price: 6.80, stock: 35, description: 'Chuletas ahumadas o naturales', imageUrl: 'https://picsum.photos/200?random=37' },
        { name: 'Carne para Asar 1kg', price: 10.00, stock: 25, description: 'Corte especial para asados', imageUrl: 'https://picsum.photos/200?random=38' },
        { name: 'Chorizo de Cerdo 500g', price: 4.00, stock: 40, description: 'Chorizo artesanal', imageUrl: 'https://picsum.photos/200?random=39' },
        { name: 'Longaniza 500g', price: 3.80, stock: 30, description: 'Embutido tradicional', imageUrl: 'https://picsum.photos/200?random=40' }
      ]
    },
    {
      categoria: 'Congelados',
      productos: [
        { name: 'Papas a la Francesa 1kg', price: 3.50, stock: 50, description: 'Papas prefritas congeladas', imageUrl: 'https://picsum.photos/200?random=41' },
        { name: 'Vegetales Mixtos 500g', price: 2.20, stock: 60, description: 'Zanahoria, chícharo, elote', imageUrl: 'https://picsum.photos/200?random=42' },
        { name: 'Brócoli Congelado 500g', price: 2.50, stock: 40, description: 'Floretes de brócoli listos', imageUrl: 'https://picsum.photos/200?random=43' },
        { name: 'Nuggets de Pollo 500g', price: 4.50, stock: 50, description: 'Nuggets crujientes', imageUrl: 'https://picsum.photos/200?random=44' },
        { name: 'Hamburguesas de Res (4 un)', price: 5.50, stock: 35, description: 'Medallones de res', imageUrl: 'https://picsum.photos/200?random=45' },
        { name: 'Filetes de Pescado Empanizados', price: 6.00, stock: 30, description: 'Filetes listos para freír', imageUrl: 'https://picsum.photos/200?random=46' },
        { name: 'Helado de Vainilla 1L', price: 4.20, stock: 28, description: 'Helado cremoso de vainilla', imageUrl: 'https://picsum.photos/200?random=47' },
        { name: 'Helado de Chocolate 1L', price: 4.20, stock: 28, description: 'Helado sabor chocolate intenso', imageUrl: 'https://picsum.photos/200?random=48' },
        { name: 'Pizza Pepperoni Congelada', price: 5.00, stock: 40, description: 'Pizza lista para hornear', imageUrl: 'https://picsum.photos/200?random=49' },
        { name: 'Waffles Congelados (10 un)', price: 3.80, stock: 45, description: 'Desayuno rápido y fácil', imageUrl: 'https://picsum.photos/200?random=50' }
      ]
    },
    {
      categoria: 'Cuidado Personal',
      productos: [
        { name: 'Shampoo Anticaspa 400ml', price: 4.80, stock: 35, description: 'Shampoo con extracto de menta', imageUrl: 'https://picsum.photos/200?random=51' },
        { name: 'Acondicionador 400ml', price: 4.50, stock: 40, description: 'Acondicionador hidratante', imageUrl: 'https://picsum.photos/200?random=52' },
        { name: 'Jabón de Tocador Exfoliante', price: 1.10, stock: 90, description: 'Jabón en barra con avena', imageUrl: 'https://picsum.photos/200?random=53' },
        { name: 'Desodorante en Spray 150ml', price: 3.50, stock: 60, description: 'Protección 48h', imageUrl: 'https://picsum.photos/200?random=54' },
        { name: 'Desodorante Roll-on 50ml', price: 2.50, stock: 70, description: 'Desodorante antitranspirante', imageUrl: 'https://picsum.photos/200?random=55' },
        { name: 'Crema Corporal Hidratante 400ml', price: 5.50, stock: 45, description: 'Para piel seca', imageUrl: 'https://picsum.photos/200?random=56' },
        { name: 'Pasta Dental 100ml', price: 2.20, stock: 100, description: 'Protección anticaries', imageUrl: 'https://picsum.photos/200?random=57' },
        { name: 'Cepillos de Dientes (2 un)', price: 3.00, stock: 80, description: 'Cerdas suaves medias', imageUrl: 'https://picsum.photos/200?random=58' },
        { name: 'Enjuague Bucal 500ml', price: 4.00, stock: 50, description: 'Sabor menta fresca', imageUrl: 'https://picsum.photos/200?random=59' },
        { name: 'Rastrillos Desechables (3 un)', price: 2.80, stock: 60, description: 'Afeitado al ras', imageUrl: 'https://picsum.photos/200?random=60' }
      ]
    },
    {
      categoria: 'Dulces y Chocolates',
      productos: [
        { name: 'Barra de Chocolate de Leche', price: 1.50, stock: 100, description: 'Chocolate clásico', imageUrl: 'https://picsum.photos/200?random=61' },
        { name: 'Barra de Chocolate Oscuro 70%', price: 2.00, stock: 80, description: 'Chocolate negro', imageUrl: 'https://picsum.photos/200?random=62' },
        { name: 'Gomitas de Frutas 100g', price: 1.20, stock: 120, description: 'Gomitas suaves variadas', imageUrl: 'https://picsum.photos/200?random=63' },
        { name: 'Caramelos Suaves de Fresa', price: 0.80, stock: 150, description: 'Dulces con sabor a fresa', imageUrl: 'https://picsum.photos/200?random=64' },
        { name: 'Chicles de Menta (Paquete)', price: 0.50, stock: 200, description: 'Refresca el aliento', imageUrl: 'https://picsum.photos/200?random=65' },
        { name: 'Galletas Rellenas de Chocolate', price: 1.50, stock: 90, description: 'Galletas con doble relleno', imageUrl: 'https://picsum.photos/200?random=66' },
        { name: 'Chocolates Rellenos (Caja)', price: 4.50, stock: 30, description: 'Surtido de trufas', imageUrl: 'https://picsum.photos/200?random=67' },
        { name: 'Paletas de Caramelo (10 un)', price: 1.50, stock: 80, description: 'Divertidas paletas', imageUrl: 'https://picsum.photos/200?random=68' },
        { name: 'Bombones de Malvavisco', price: 1.80, stock: 70, description: 'Bombones blancos esponjosos', imageUrl: 'https://picsum.photos/200?random=69' },
        { name: 'Dulce de Leche 250g', price: 2.50, stock: 50, description: 'Arequipe tradicional', imageUrl: 'https://picsum.photos/200?random=70' }
      ]
    },
    {
      categoria: 'Farmacia',
      productos: [
        { name: 'Paracetamol 500mg (10 un)', price: 1.50, stock: 100, description: 'Alivio de dolor y fiebre', imageUrl: 'https://picsum.photos/200?random=71' },
        { name: 'Ibuprofeno 400mg (10 un)', price: 1.80, stock: 100, description: 'Antiinflamatorio', imageUrl: 'https://picsum.photos/200?random=72' },
        { name: 'Vitamina C 1g (10 tabletas)', price: 2.50, stock: 80, description: 'Suplemento vitamínico', imageUrl: 'https://picsum.photos/200?random=73' },
        { name: 'Alcohol Etílico 70% 250ml', price: 1.50, stock: 120, description: 'Antiséptico de uso externo', imageUrl: 'https://picsum.photos/200?random=74' },
        { name: 'Algodón Plisado 50g', price: 1.00, stock: 150, description: 'Algodón absorbente', imageUrl: 'https://picsum.photos/200?random=75' },
        { name: 'Curitas Adhesivas (20 un)', price: 1.20, stock: 200, description: 'Protección de heridas menores', imageUrl: 'https://picsum.photos/200?random=76' },
        { name: 'Gasas Estériles (5 un)', price: 1.00, stock: 100, description: 'Para limpieza de heridas', imageUrl: 'https://picsum.photos/200?random=77' },
        { name: 'Agua Oxigenada 100ml', price: 1.10, stock: 90, description: 'Peróxido de hidrógeno', imageUrl: 'https://picsum.photos/200?random=78' },
        { name: 'Antigripal en Cápsulas (10 un)', price: 2.80, stock: 70, description: 'Alivio rápido de síntomas', imageUrl: 'https://picsum.photos/200?random=79' },
        { name: 'Jarabe para la Tos 120ml', price: 4.50, stock: 50, description: 'Expectorante', imageUrl: 'https://picsum.photos/200?random=80' }
      ]
    },
    {
      categoria: 'Frutas',
      productos: [
        { name: 'Manzana Roja 1kg', price: 2.50, stock: 60, description: 'Manzanas frescas dulces', imageUrl: 'https://picsum.photos/200?random=81' },
        { name: 'Manzana Verde 1kg', price: 2.60, stock: 50, description: 'Manzanas ácidas crujientes', imageUrl: 'https://picsum.photos/200?random=82' },
        { name: 'Plátano 1kg', price: 1.20, stock: 100, description: 'Plátano maduro', imageUrl: 'https://picsum.photos/200?random=83' },
        { name: 'Naranja 1kg', price: 1.50, stock: 80, description: 'Naranjas para jugo', imageUrl: 'https://picsum.photos/200?random=84' },
        { name: 'Uva Verde sin Semilla 500g', price: 3.50, stock: 40, description: 'Uvas frescas y dulces', imageUrl: 'https://picsum.photos/200?random=85' },
        { name: 'Uva Roja 500g', price: 3.20, stock: 40, description: 'Uvas tintas jugosas', imageUrl: 'https://picsum.photos/200?random=86' },
        { name: 'Fresa 500g', price: 3.80, stock: 35, description: 'Fresas seleccionadas', imageUrl: 'https://picsum.photos/200?random=87' },
        { name: 'Limón 1kg', price: 1.50, stock: 90, description: 'Limón jugoso', imageUrl: 'https://picsum.photos/200?random=88' },
        { name: 'Papaya 1kg', price: 2.00, stock: 45, description: 'Papaya fresca entera', imageUrl: 'https://picsum.photos/200?random=89' },
        { name: 'Sandía (Por pieza)', price: 4.00, stock: 20, description: 'Sandía entera mediana', imageUrl: 'https://picsum.photos/200?random=90' }
      ]
    },
    {
      categoria: 'Hogar',
      productos: [
        { name: 'Foco LED 10W (Luz Blanca)', price: 2.50, stock: 100, description: 'Iluminación eficiente', imageUrl: 'https://picsum.photos/200?random=91' },
        { name: 'Pilas AA (4 un)', price: 3.00, stock: 80, description: 'Baterías alcalinas', imageUrl: 'https://picsum.photos/200?random=92' },
        { name: 'Pilas AAA (4 un)', price: 3.00, stock: 80, description: 'Baterías alcalinas AAA', imageUrl: 'https://picsum.photos/200?random=93' },
        { name: 'Servilletas de Papel (200 un)', price: 1.50, stock: 150, description: 'Doble hoja suave', imageUrl: 'https://picsum.photos/200?random=94' },
        { name: 'Bolsas para Basura Grandes', price: 2.80, stock: 90, description: 'Resistentes y antiescurrimiento', imageUrl: 'https://picsum.photos/200?random=95' },
        { name: 'Bolsas Reutilizables de Tela', price: 1.50, stock: 120, description: 'Eco amigables', imageUrl: 'https://picsum.photos/200?random=96' },
        { name: 'Cinta Adhesiva Transparente', price: 1.00, stock: 100, description: 'Cinta multipropósito', imageUrl: 'https://picsum.photos/200?random=97' },
        { name: 'Fósforos (10 cajas)', price: 1.20, stock: 150, description: 'Cerillos de madera', imageUrl: 'https://picsum.photos/200?random=98' },
        { name: 'Velas Blancas (4 un)', price: 2.00, stock: 60, description: 'Velas de parafina', imageUrl: 'https://picsum.photos/200?random=99' },
        { name: 'Papel Aluminio 15m', price: 3.50, stock: 70, description: 'Rollo de papel aluminio', imageUrl: 'https://picsum.photos/200?random=100' }
      ]
    },
    {
      categoria: 'Lácteos',
      productos: [
        { name: 'Leche Entera 1L', price: 1.50, stock: 100, description: 'Leche entera pasteurizada', imageUrl: 'https://picsum.photos/200?random=101' },
        { name: 'Leche Deslactosada 1L', price: 1.70, stock: 90, description: 'De fácil digestión', imageUrl: 'https://picsum.photos/200?random=102' },
        { name: 'Leche Semidescremada 1L', price: 1.60, stock: 85, description: 'Menos grasa', imageUrl: 'https://picsum.photos/200?random=103' },
        { name: 'Yogurt Griego Natural', price: 2.20, stock: 50, description: 'Yogurt griego sin azúcar', imageUrl: 'https://picsum.photos/200?random=104' },
        { name: 'Yogurt de Fresa 1L', price: 2.50, stock: 60, description: 'Yogurt líquido sabor fresa', imageUrl: 'https://picsum.photos/200?random=105' },
        { name: 'Mantequilla con Sal 250g', price: 2.80, stock: 70, description: 'Mantequilla de vaca', imageUrl: 'https://picsum.photos/200?random=106' },
        { name: 'Margarina 250g', price: 1.50, stock: 80, description: 'Margarina untable', imageUrl: 'https://picsum.photos/200?random=107' },
        { name: 'Crema de Leche 200ml', price: 1.80, stock: 60, description: 'Para postres y sopas', imageUrl: 'https://picsum.photos/200?random=108' },
        { name: 'Leche Condensada 395g', price: 2.50, stock: 90, description: 'Postres dulces', imageUrl: 'https://picsum.photos/200?random=109' },
        { name: 'Leche Evaporada 360g', price: 2.00, stock: 80, description: 'Para cocinar y bebidas', imageUrl: 'https://picsum.photos/200?random=110' }
      ]
    },
    {
      categoria: 'Limpieza',
      productos: [
        { name: 'Detergente Líquido 3L', price: 11.50, stock: 30, description: 'Detergente para ropa', imageUrl: 'https://picsum.photos/200?random=111' },
        { name: 'Detergente en Polvo 1kg', price: 3.50, stock: 50, description: 'Poder quitamanchas', imageUrl: 'https://picsum.photos/200?random=112' },
        { name: 'Suavizante de Telas 1L', price: 2.80, stock: 60, description: 'Aroma floral duradero', imageUrl: 'https://picsum.photos/200?random=113' },
        { name: 'Lavavajillas Líquido 500ml', price: 1.90, stock: 75, description: 'Arranca grasa aroma limón', imageUrl: 'https://picsum.photos/200?random=114' },
        { name: 'Esponja de Fibra (2 un)', price: 1.20, stock: 100, description: 'Esponjas para trastes', imageUrl: 'https://picsum.photos/200?random=115' },
        { name: 'Limpiador Multiusos 1L', price: 2.50, stock: 80, description: 'Limpia pisos y superficies', imageUrl: 'https://picsum.photos/200?random=116' },
        { name: 'Cloro 1L', price: 1.50, stock: 90, description: 'Desinfectante', imageUrl: 'https://picsum.photos/200?random=117' },
        { name: 'Escoba con Mango', price: 4.50, stock: 40, description: 'Cerdas resistentes', imageUrl: 'https://picsum.photos/200?random=118' },
        { name: 'Trapeador de Algodón', price: 3.80, stock: 45, description: 'Alta absorción', imageUrl: 'https://picsum.photos/200?random=119' },
        { name: 'Insecticida en Spray 400ml', price: 5.00, stock: 50, description: 'Mata insectos voladores', imageUrl: 'https://picsum.photos/200?random=120' }
      ]
    },
    {
      categoria: 'Mascotas',
      productos: [
        { name: 'Alimento para Perro Adulto 2kg', price: 8.50, stock: 40, description: 'Sabor carne y cereales', imageUrl: 'https://picsum.photos/200?random=121' },
        { name: 'Alimento para Cachorro 2kg', price: 9.00, stock: 35, description: 'Alto en proteínas', imageUrl: 'https://picsum.photos/200?random=122' },
        { name: 'Alimento para Gato Adulto 1.5kg', price: 7.50, stock: 40, description: 'Sabor pescado', imageUrl: 'https://picsum.photos/200?random=123' },
        { name: 'Alimento Húmedo Gato (Sobre)', price: 1.20, stock: 150, description: 'Trozos de atún', imageUrl: 'https://picsum.photos/200?random=124' },
        { name: 'Alimento Húmedo Perro (Lata)', price: 2.50, stock: 80, description: 'Carne en su jugo', imageUrl: 'https://picsum.photos/200?random=125' },
        { name: 'Premios para Perro 100g', price: 3.00, stock: 60, description: 'Galletas sabor tocino', imageUrl: 'https://picsum.photos/200?random=126' },
        { name: 'Arena para Gato 4kg', price: 6.50, stock: 30, description: 'Arena aglomerante', imageUrl: 'https://picsum.photos/200?random=127' },
        { name: 'Shampoo para Perros 250ml', price: 4.00, stock: 45, description: 'Cuidado del pelaje', imageUrl: 'https://picsum.photos/200?random=128' },
        { name: 'Juguete para Morder (Hueso)', price: 2.50, stock: 70, description: 'Caucho resistente', imageUrl: 'https://picsum.photos/200?random=129' },
        { name: 'Collar Ajustable para Perro', price: 5.00, stock: 50, description: 'Nylon reforzado', imageUrl: 'https://picsum.photos/200?random=130' }
      ]
    },
    {
      categoria: 'Panadería',
      productos: [
        { name: 'Pan Tajado Blanco', price: 1.90, stock: 45, description: 'Para sandwiches', imageUrl: 'https://picsum.photos/200?random=131' },
        { name: 'Pan Tajado Integral', price: 2.10, stock: 35, description: 'Pan con semillas', imageUrl: 'https://picsum.photos/200?random=132' },
        { name: 'Croissant de Mantequilla', price: 1.00, stock: 60, description: 'Pan horneado fresco', imageUrl: 'https://picsum.photos/200?random=133' },
        { name: 'Pan para Hamburguesa (6 un)', price: 2.50, stock: 50, description: 'Con ajonjolí', imageUrl: 'https://picsum.photos/200?random=134' },
        { name: 'Pan para Hot Dog (8 un)', price: 2.30, stock: 50, description: 'Medianos y suaves', imageUrl: 'https://picsum.photos/200?random=135' },
        { name: 'Tortillas de Harina (10 un)', price: 1.80, stock: 80, description: 'Ideal para burritos', imageUrl: 'https://picsum.photos/200?random=136' },
        { name: 'Tortillas de Maíz 500g', price: 1.20, stock: 90, description: 'Recién hechas', imageUrl: 'https://picsum.photos/200?random=137' },
        { name: 'Muffin de Chocolate', price: 1.50, stock: 40, description: 'Relleno de chispas', imageUrl: 'https://picsum.photos/200?random=138' },
        { name: 'Galletas de Avena 200g', price: 2.00, stock: 60, description: 'Caseras de avena', imageUrl: 'https://picsum.photos/200?random=139' },
        { name: 'Baguette Francés', price: 1.50, stock: 30, description: 'Pan crujiente', imageUrl: 'https://picsum.photos/200?random=140' }
      ]
    },
    {
      categoria: 'Pastas y Cereales',
      productos: [
        { name: 'Espagueti 500g', price: 1.10, stock: 120, description: 'Pasta de trigo durum', imageUrl: 'https://picsum.photos/200?random=141' },
        { name: 'Pasta Fideos 250g', price: 0.80, stock: 150, description: 'Para sopas', imageUrl: 'https://picsum.photos/200?random=142' },
        { name: 'Macarrones 500g', price: 1.20, stock: 100, description: 'Pasta corta', imageUrl: 'https://picsum.photos/200?random=143' },
        { name: 'Cereal de Maíz Azucarado 500g', price: 3.50, stock: 60, description: 'Desayuno dulce', imageUrl: 'https://picsum.photos/200?random=144' },
        { name: 'Avena en Hojuelas 500g', price: 1.80, stock: 80, description: 'Avena integral', imageUrl: 'https://picsum.photos/200?random=145' },
        { name: 'Granola con Frutos Rojos 300g', price: 4.00, stock: 50, description: 'Crujiente y natural', imageUrl: 'https://picsum.photos/200?random=146' },
        { name: 'Cereal de Trigo Integral 400g', price: 3.80, stock: 55, description: 'Alto en fibra', imageUrl: 'https://picsum.photos/200?random=147' },
        { name: 'Pasta Fusilli 500g', price: 1.30, stock: 90, description: 'Tornillos de pasta', imageUrl: 'https://picsum.photos/200?random=148' },
        { name: 'Salsa para Pasta de Tomate 400g', price: 2.00, stock: 70, description: 'Lista para usar', imageUrl: 'https://picsum.photos/200?random=149' },
        { name: 'Fideos de Arroz 200g', price: 2.50, stock: 40, description: 'Para comida oriental', imageUrl: 'https://picsum.photos/200?random=150' }
      ]
    },
    {
      categoria: 'Pescados y Mariscos',
      productos: [
        { name: 'Atún en Agua (Lata)', price: 1.50, stock: 200, description: 'Atún aleta amarilla', imageUrl: 'https://picsum.photos/200?random=151' },
        { name: 'Atún en Aceite (Lata)', price: 1.60, stock: 180, description: 'Atún en aceite de soya', imageUrl: 'https://picsum.photos/200?random=152' },
        { name: 'Filete de Salmón Congelado 500g', price: 12.00, stock: 20, description: 'Corte premium', imageUrl: 'https://picsum.photos/200?random=153' },
        { name: 'Filete de Tilapia Congelado 500g', price: 5.50, stock: 40, description: 'Filetes sin espinas', imageUrl: 'https://picsum.photos/200?random=154' },
        { name: 'Camarón Pacotilla 500g', price: 9.00, stock: 30, description: 'Camarón cocido y pelado', imageUrl: 'https://picsum.photos/200?random=155' },
        { name: 'Sardinas en Tomate (Lata)', price: 1.80, stock: 90, description: 'Ricas en Omega 3', imageUrl: 'https://picsum.photos/200?random=156' },
        { name: 'Anillos de Calamar 500g', price: 6.50, stock: 25, description: 'Listos para empanizar', imageUrl: 'https://picsum.photos/200?random=157' },
        { name: 'Pulpo Cocido 500g', price: 14.00, stock: 15, description: 'Tentáculos de pulpo', imageUrl: 'https://picsum.photos/200?random=158' },
        { name: 'Medallones de Atún 500g', price: 8.50, stock: 25, description: 'Atún fresco congelado', imageUrl: 'https://picsum.photos/200?random=159' },
        { name: 'Palitos de Surimi 250g', price: 3.00, stock: 50, description: 'Imitación cangrejo', imageUrl: 'https://picsum.photos/200?random=160' }
      ]
    },
    {
      categoria: 'Quesos y Fiambres',
      productos: [
        { name: 'Queso Mozzarella 500g', price: 4.50, stock: 50, description: 'Queso rallado o bloque', imageUrl: 'https://picsum.photos/200?random=161' },
        { name: 'Queso Panela 400g', price: 3.80, stock: 60, description: 'Queso fresco', imageUrl: 'https://picsum.photos/200?random=162' },
        { name: 'Queso Amarillo en Rebanadas (10 un)', price: 2.50, stock: 80, description: 'Ideal para sandwiches', imageUrl: 'https://picsum.photos/200?random=163' },
        { name: 'Jamón de Pechuga de Pavo 250g', price: 3.50, stock: 70, description: 'Jamón bajo en grasa', imageUrl: 'https://picsum.photos/200?random=164' },
        { name: 'Jamón de Cerdo 250g', price: 3.00, stock: 70, description: 'Jamón cocido clásico', imageUrl: 'https://picsum.photos/200?random=165' },
        { name: 'Salchichas de Pavo (500g)', price: 3.20, stock: 65, description: 'Salchichas ligeras', imageUrl: 'https://picsum.photos/200?random=166' },
        { name: 'Salchicha para Asar 500g', price: 4.00, stock: 50, description: 'Gruesas y jugosas', imageUrl: 'https://picsum.photos/200?random=167' },
        { name: 'Salami Rebanado 150g', price: 4.50, stock: 40, description: 'Salami madurado', imageUrl: 'https://picsum.photos/200?random=168' },
        { name: 'Peperoni Rebanado 150g', price: 4.00, stock: 45, description: 'Perfecto para pizza', imageUrl: 'https://picsum.photos/200?random=169' },
        { name: 'Tocino Ahumado 250g', price: 4.80, stock: 50, description: 'Tiras de tocino crujiente', imageUrl: 'https://picsum.photos/200?random=170' }
      ]
    },
    {
      categoria: 'Salsas y Aderezos',
      productos: [
        { name: 'Ketchup 500g', price: 2.00, stock: 90, description: 'Salsa de tomate dulce', imageUrl: 'https://picsum.photos/200?random=171' },
        { name: 'Mayonesa 400g', price: 2.50, stock: 80, description: 'Mayonesa clásica', imageUrl: 'https://picsum.photos/200?random=172' },
        { name: 'Mostaza Amarilla 250g', price: 1.50, stock: 100, description: 'Mostaza tradicional', imageUrl: 'https://picsum.photos/200?random=173' },
        { name: 'Salsa Picante 150ml', price: 1.20, stock: 120, description: 'Salsa roja picante', imageUrl: 'https://picsum.photos/200?random=174' },
        { name: 'Salsa de Soya 300ml', price: 2.20, stock: 70, description: 'Aderezo oriental', imageUrl: 'https://picsum.photos/200?random=175' },
        { name: 'Aderezo Ranch 250ml', price: 3.00, stock: 50, description: 'Para ensaladas', imageUrl: 'https://picsum.photos/200?random=176' },
        { name: 'Aderezo César 250ml', price: 3.00, stock: 50, description: 'Clásico sabor César', imageUrl: 'https://picsum.photos/200?random=177' },
        { name: 'Salsa BBQ 400g', price: 2.80, stock: 60, description: 'Salsa barbacoa ahumada', imageUrl: 'https://picsum.photos/200?random=178' },
        { name: 'Vinagre Blanco 1L', price: 1.50, stock: 100, description: 'Vinagre multiusos', imageUrl: 'https://picsum.photos/200?random=179' },
        { name: 'Vinagre de Manzana 500ml', price: 2.00, stock: 80, description: 'Sabor suave y afrutado', imageUrl: 'https://picsum.photos/200?random=180' }
      ]
    },
    {
      categoria: 'Snacks',
      productos: [
        { name: 'Papas Fritas Clásicas 150g', price: 1.50, stock: 120, description: 'Con un toque de sal', imageUrl: 'https://picsum.photos/200?random=181' },
        { name: 'Papas Sabor Queso 150g', price: 1.60, stock: 100, description: 'Crujientes de queso', imageUrl: 'https://picsum.photos/200?random=182' },
        { name: 'Nachos de Maíz 200g', price: 1.80, stock: 110, description: 'Tortillas fritas de maíz', imageUrl: 'https://picsum.photos/200?random=183' },
        { name: 'Palomitas de Microondas (3 un)', price: 2.50, stock: 80, description: 'Sabor mantequilla', imageUrl: 'https://picsum.photos/200?random=184' },
        { name: 'Cacahuates Japoneses 100g', price: 1.00, stock: 150, description: 'Cacahuates cubiertos', imageUrl: 'https://picsum.photos/200?random=185' },
        { name: 'Mix de Frutos Secos 150g', price: 3.50, stock: 60, description: 'Almendras, nueces y pasas', imageUrl: 'https://picsum.photos/200?random=186' },
        { name: 'Nueces de la India 100g', price: 4.50, stock: 40, description: 'Premium y saladas', imageUrl: 'https://picsum.photos/200?random=187' },
        { name: 'Churritos de Maíz con Chile 150g', price: 1.20, stock: 100, description: 'Snack picante', imageUrl: 'https://picsum.photos/200?random=188' },
        { name: 'Barras de Cereal (6 un)', price: 3.00, stock: 70, description: 'Avena y miel', imageUrl: 'https://picsum.photos/200?random=189' },
        { name: 'Galletas Saladas 200g', price: 1.50, stock: 90, description: 'Ligeras y crujientes', imageUrl: 'https://picsum.photos/200?random=190' }
      ]
    },
    {
      categoria: 'Verduras',
      productos: [
        { name: 'Tomate Chonto 1kg', price: 1.80, stock: 80, description: 'Tomates frescos', imageUrl: 'https://picsum.photos/200?random=191' },
        { name: 'Cebolla Blanca 1kg', price: 1.50, stock: 90, description: 'Cebolla grande', imageUrl: 'https://picsum.photos/200?random=192' },
        { name: 'Cebolla Morada 1kg', price: 1.80, stock: 70, description: 'Sabor intenso', imageUrl: 'https://picsum.photos/200?random=193' },
        { name: 'Papa Blanca 1kg', price: 1.20, stock: 120, description: 'Para puré o freír', imageUrl: 'https://picsum.photos/200?random=194' },
        { name: 'Zanahoria 1kg', price: 1.00, stock: 100, description: 'Ricas en vitamina A', imageUrl: 'https://picsum.photos/200?random=195' },
        { name: 'Lechuga Crespa', price: 1.20, stock: 50, description: 'Lechuga hidropónica lavada', imageUrl: 'https://picsum.photos/200?random=196' },
        { name: 'Aguacate Hass 1kg', price: 4.50, stock: 40, description: 'Cremoso y en su punto', imageUrl: 'https://picsum.photos/200?random=197' },
        { name: 'Brócoli Fresco (Por pieza)', price: 2.00, stock: 45, description: 'Verde y fresco', imageUrl: 'https://picsum.photos/200?random=198' },
        { name: 'Pimiento Morrón (Por pieza)', price: 1.50, stock: 60, description: 'Rojo, verde o amarillo', imageUrl: 'https://picsum.photos/200?random=199' },
        { name: 'Champiñones Blancos 250g', price: 2.50, stock: 35, description: 'Frescos y enteros', imageUrl: 'https://picsum.photos/200?random=200' }
      ]
    }
  ];

  // 3. Inyección
  for (const item of datosSemilla) {
    const categoriaCreada = await prisma.category.upsert({
      where: { name: item.categoria },
      update: {},
      create: { name: item.categoria },
    });

    for (const prod of item.productos) {
      const productoExistente = await prisma.product.findFirst({
        where: { name: prod.name }
      });

      if (productoExistente) {
        await prisma.product.update({
          where: { id: productoExistente.id },
          data: {
            price: prod.price,
            stock: prod.stock,
            description: prod.description,
            imageUrl: prod.imageUrl,
            categoryId: categoriaCreada.id
          }
        });
      } else {
        await prisma.product.create({
          data: {
            name: prod.name,
            price: prod.price,
            stock: prod.stock,
            description: prod.description,
            imageUrl: prod.imageUrl,
            categoryId: categoriaCreada.id
          }
        });
      }
    }
  }

  console.log('Categorías y productos inyectados correctamente.');
  console.log('Seeding completado con éxito. ¡Base de datos lista!');
}

main()
  .catch((e) => {
    console.error('Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });