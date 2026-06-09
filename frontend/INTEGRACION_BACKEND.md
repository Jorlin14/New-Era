# 🔌 Guía de Integración con Backend

Esta guía está diseñada para el equipo de backend que conectará este frontend con la API.

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Endpoints Requeridos](#endpoints-requeridos)
3. [Modelos de Datos](#modelos-de-datos)
4. [Configuración de CORS](#configuración-de-cors)
5. [Autenticación](#autenticación)
6. [Proceso de Integración](#proceso-de-integración)
7. [Testing de la Integración](#testing-de-la-integración)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Resumen Ejecutivo

**Estado Actual**: El frontend funciona con datos mock para desarrollo independiente.

**Objetivo**: Conectar el frontend con el backend real reemplazando las llamadas mock por peticiones HTTP reales.

**Archivos a Modificar**: 
- `lib/api.ts` - Descomentar código de integración real
- `.env.local` - Configurar URL del backend

**Tiempo Estimado**: 1-2 horas

---

## 🔗 Endpoints Requeridos

### 1. GET `/api/categories`

**Descripción**: Obtiene todas las categorías de productos activas.

**Request**:
```http
GET /api/categories HTTP/1.1
Host: localhost:4000
```

**Response Exitosa** (200):
```json
{
  "data": [
    {
      "id": "cat-1",
      "name": "Frutas y Verduras",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "cat-2",
      "name": "Lácteos y Huevos",
      "createdAt": "2024-01-15T10:31:00.000Z"
    }
  ]
}
```

**Response Error** (500):
```json
{
  "error": "Error al obtener categorías",
  "message": "Database connection failed"
}
```

**Notas**:
- Retornar solo categorías que tengan productos activos
- Ordenar alfabéticamente por `name`
- El frontend hace cache de 60 segundos (revalidate: 60)

---

### 2. GET `/api/products`

**Descripción**: Obtiene productos con filtros opcionales de búsqueda y categoría.

**Query Parameters**:
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `search` | string | No | Término de búsqueda (buscar en nombre y descripción) |
| `categoryId` | string | No | ID de categoría para filtrar |

**Request Example 1** - Todos los productos:
```http
GET /api/products HTTP/1.1
Host: localhost:4000
```

**Request Example 2** - Búsqueda:
```http
GET /api/products?search=manzana HTTP/1.1
Host: localhost:4000
```

**Request Example 3** - Por categoría:
```http
GET /api/products?categoryId=cat-1 HTTP/1.1
Host: localhost:4000
```

**Request Example 4** - Búsqueda + Categoría:
```http
GET /api/products?search=frescas&categoryId=cat-1 HTTP/1.1
Host: localhost:4000
```

**Response Exitosa** (200):
```json
{
  "data": [
    {
      "id": "prod-1",
      "name": "Manzana Verde",
      "description": "Manzanas verdes frescas importadas",
      "price": 4500,
      "stock": 150,
      "imageUrl": null,
      "isActive": true,
      "categoryId": "cat-1",
      "category": {
        "id": "cat-1",
        "name": "Frutas y Verduras"
      },
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-20T14:20:00.000Z"
    }
  ]
}
```

**Response Error** (500):
```json
{
  "error": "Error al obtener productos",
  "message": "Database query failed"
}
```

**Reglas de Negocio**:
- ✅ Retornar solo productos con `isActive: true`
- ✅ Búsqueda case-insensitive
- ✅ Búsqueda en campos `name` y `description`
- ✅ Incluir objeto `category` relacionado
- ✅ Ordenar por: relevancia (si hay búsqueda) o por `createdAt DESC`
- ✅ El frontend hace cache de 30 segundos (revalidate: 30)

---

## 📊 Modelos de Datos

### Modelo: Category

```typescript
interface Category {
  id: string;              // UUID o ID único
  name: string;            // Nombre de la categoría
  createdAt?: string;      // ISO 8601 timestamp (opcional)
}
```

**Ejemplos de categorías**:
- "Frutas y Verduras"
- "Lácteos y Huevos"
- "Carnes y Pescados"
- "Panadería"
- "Bebidas"
- "Despensa"
- "Snacks"
- "Limpieza"

### Modelo: Product

```typescript
interface Product {
  id: string;              // UUID o ID único
  name: string;            // Nombre del producto
  description: string | null;  // Descripción (puede ser null)
  price: number;           // Precio en COP (pesos colombianos)
  stock: number;           // Cantidad disponible (>= 0)
  imageUrl: string | null; // URL de imagen (puede ser null)
  isActive: boolean;       // Si está activo/visible
  categoryId: string;      // ID de la categoría
  category?: Category;     // Objeto categoría (opcional, recomendado)
  createdAt?: string;      // ISO 8601 timestamp (opcional)
  updatedAt?: string;      // ISO 8601 timestamp (opcional)
}
```

**Reglas de Validación**:
- `price` debe ser >= 0
- `stock` debe ser >= 0
- `name` es requerido (no vacío)
- `categoryId` debe existir en la tabla categories

**Nota sobre imágenes**: 
- Si `imageUrl` es null, el frontend muestra un icono SVG genérico
- URLs deben ser absolutas (ej: `https://cdn.ejemplo.com/imagen.jpg`)

---

## 🔒 Configuración de CORS

El backend debe permitir CORS para las siguientes URLs:

### Desarrollo
```javascript
// Express.js example
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',    // Frontend en desarrollo
    'http://localhost:3000'     // Alternativa
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Producción
```javascript
app.use(cors({
  origin: [
    'https://tudominio.com',
    'https://www.tudominio.com'
  ],
  credentials: true
}));
```

---

## 🔐 Autenticación

**Nota**: El frontend actualmente NO implementa autenticación real (solo UI).

Para implementación futura, el frontend esperará:

### Login Endpoint (Futuro)

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-1",
    "name": "Juan Pérez",
    "email": "user@example.com"
  }
}
```

### Headers en Requests Autenticados

```http
GET /api/orders
Authorization: Bearer jwt-token-here
```

---

## ⚙️ Proceso de Integración

### Paso 1: Backend - Verificar Endpoints

```bash
# Probar endpoints con curl o Postman

# Test 1: Categorías
curl http://localhost:4000/api/categories

# Test 2: Todos los productos
curl http://localhost:4000/api/products

# Test 3: Búsqueda
curl http://localhost:4000/api/products?search=manzana

# Test 4: Filtro por categoría
curl http://localhost:4000/api/products?categoryId=cat-1
```

**Checklist Backend**:
- [ ] Endpoint `/api/categories` funcionando
- [ ] Endpoint `/api/products` funcionando
- [ ] Filtro de búsqueda implementado
- [ ] Filtro por categoría implementado
- [ ] CORS configurado correctamente
- [ ] Retorna solo productos con `isActive: true`
- [ ] Incluye objeto `category` en productos

---

### Paso 2: Frontend - Configurar Variables de Entorno

Crear/editar `.env.local` en `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Producción**:
```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com/api
```

---

### Paso 3: Frontend - Activar Integración Real

Editar `lib/api.ts`:

#### getCategories()

**Comentar** el código mock:
```typescript
// export async function getCategories(): Promise<Category[]> {
//   await simulateNetworkDelay(100);
//   return MOCK_CATEGORIES;
// }
```

**Descomentar** el código real:
```typescript
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${getApiBaseUrl()}/categories`, { 
    next: { revalidate: 60 } 
  });
  if (!res.ok) throw new Error('Error al obtener categorías');
  const { data } = await res.json();
  return data;
}
```

#### getProducts()

**Comentar** el código mock (líneas ~30-50):
```typescript
// export async function getProducts(...) {
//   await simulateNetworkDelay(150);
//   let results = MOCK_PRODUCTS.filter(...);
//   ...
//   return results;
// }
```

**Descomentar** el código real:
```typescript
export async function getProducts(
  search?: string,
  categoryId?: string
): Promise<Product[]> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (categoryId) params.set('categoryId', categoryId);
  
  const res = await fetch(`${getApiBaseUrl()}/products?${params}`, { 
    next: { revalidate: 30 } 
  });
  
  if (!res.ok) throw new Error('Error al obtener productos');
  const { data } = await res.json();
  return data;
}
```

---

### Paso 4: Testing

```bash
# Reiniciar servidor de desarrollo
npm run dev
```

**Tests Manuales**:

1. ✅ **Home carga correctamente**
   - Ver categorías desde el backend
   - Ver productos desde el backend

2. ✅ **Búsqueda funciona**
   - Escribir en barra de búsqueda
   - Verificar resultados del backend

3. ✅ **Filtros funcionan**
   - Clic en una categoría
   - Verificar productos filtrados

4. ✅ **Agregar al carrito**
   - Agregar producto
   - Verificar stock se respeta

5. ✅ **Carrito funciona**
   - Abrir drawer
   - Modificar cantidades
   - Ver cálculo de totales

---

## 🧪 Testing de la Integración

### Tests Recomendados

```bash
# Test 1: ¿El backend responde?
curl -i http://localhost:4000/api/categories

# Esperado: HTTP 200 + JSON con array de categorías

# Test 2: ¿CORS configurado?
curl -i -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS http://localhost:4000/api/products

# Esperado: Headers CORS presentes

# Test 3: ¿Búsqueda funciona?
curl http://localhost:4000/api/products?search=test

# Esperado: HTTP 200 + productos filtrados

# Test 4: ¿Formato correcto?
curl http://localhost:4000/api/products | jq '.data[0]'

# Esperado: Objeto producto con todos los campos
```

### Checklist Final

- [ ] Backend en puerto 4000 (o configurado en .env)
- [ ] Frontend en puerto 5173
- [ ] Variables de entorno configuradas
- [ ] Código de integración descomentado en `lib/api.ts`
- [ ] CORS permitiendo localhost:5173
- [ ] Categorías cargan desde backend
- [ ] Productos cargan desde backend
- [ ] Búsqueda funciona
- [ ] Filtros por categoría funcionan
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en terminal del backend

---

## 🐛 Troubleshooting

### Error: "CORS policy"

**Síntoma**:
```
Access to fetch at 'http://localhost:4000/api/products' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Solución**:
1. Verificar que CORS esté configurado en el backend
2. Verificar que el origen incluya `http://localhost:5173`
3. Reiniciar servidor backend después de cambios

---

### Error: "Failed to fetch"

**Síntoma**:
```
TypeError: Failed to fetch
```

**Causas Comunes**:
1. Backend no está corriendo
2. URL incorrecta en `.env.local`
3. Puerto incorrecto

**Solución**:
```bash
# Verificar que el backend esté corriendo
curl http://localhost:4000/api/categories

# Verificar variable de entorno
echo $NEXT_PUBLIC_API_URL

# Reiniciar frontend
npm run dev
```

---

### Error: "Cannot read property 'map' of undefined"

**Síntoma**: Frontend muestra error al cargar productos

**Causas**:
1. Backend no retorna `{ data: [...] }`
2. Estructura de respuesta incorrecta

**Solución**:
Verificar que el backend retorne:
```json
{
  "data": [...]  // ← IMPORTANTE: "data" como key
}
```

NO:
```json
[...]  // ← Sin wrapper "data"
```

---

### Productos no muestran categoría

**Síntoma**: Categoría aparece como undefined

**Solución**:
Asegurarse de incluir `category` en el JOIN:

```sql
-- SQL Example
SELECT p.*, 
       json_build_object('id', c.id, 'name', c.name) as category
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
```

---

### Performance lento

**Síntoma**: Carga lenta de productos

**Soluciones**:
1. Agregar índices en base de datos:
   ```sql
   CREATE INDEX idx_products_category_id ON products(category_id);
   CREATE INDEX idx_products_is_active ON products(is_active);
   CREATE INDEX idx_products_name ON products(name);
   ```

2. Implementar paginación (futuro):
   ```
   GET /api/products?page=1&limit=20
   ```

3. Optimizar queries (usar SELECT específico, no SELECT *)

---

## 📞 Contacto

Si tienes dudas durante la integración:

- **Frontend Lead**: [Tu Nombre] - [email]
- **Backend Lead**: [Nombre] - [email]
- **Slack Channel**: #integracion-frontend-backend

---

## ✅ Checklist de Entrega

Antes de considerar la integración completa:

### Backend
- [ ] Endpoints `/api/categories` y `/api/products` funcionando
- [ ] Filtros de búsqueda implementados
- [ ] CORS configurado para desarrollo y producción
- [ ] Retorna solo productos activos (`isActive: true`)
- [ ] Incluye objeto `category` en productos
- [ ] Documentación de API actualizada
- [ ] Tests unitarios de endpoints pasando

### Frontend
- [ ] Variable `NEXT_PUBLIC_API_URL` configurada
- [ ] Código de integración descomentado en `lib/api.ts`
- [ ] Código mock comentado
- [ ] Probado en desarrollo (localhost)
- [ ] Sin errores en consola del navegador
- [ ] Búsqueda funcionando correctamente
- [ ] Filtros de categoría funcionando
- [ ] Carrito funcionando con productos reales

### Testing Conjunto
- [ ] Probado flujo completo: búsqueda → selección → carrito
- [ ] Probado con red lenta (throttling en DevTools)
- [ ] Probado con backend caído (manejo de errores)
- [ ] Probado con diferentes navegadores (Chrome, Firefox, Safari)
- [ ] Probado en móvil

### Producción (Deploy)
- [ ] Variables de entorno de producción configuradas
- [ ] Build de producción exitoso (`npm run build`)
- [ ] Dominio y SSL configurados
- [ ] Monitore backend configurado
- [ ] Plan de rollback definido

---

**¡Éxito con la integración!** 🚀
