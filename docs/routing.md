# Rutas y Navegación

## 1. Configuración de React Router
Para el manejo de las rutas en el frontend, hemos implementado `react-router-dom`. La aplicación principal está envuelta por un `<BrowserRouter>` a nivel de raíz (`main.tsx`).

## 2. Estructura de Páginas
Hemos sustituido el renderizado condicional manual por el componente `<Routes>`. El mapa de rutas es el siguiente:
* `/` -> Carga el Dashboard principal (`Home.tsx`).
* `/scanner` -> Carga el módulo de escaneo de alimentos (`Scanner.tsx`).
* `/gym` -> Carga el módulo de registro de volumen de entrenamiento (`Gym.tsx`).
* `/profile` -> Carga el motor biométrico (`Profile.tsx`).

## 3. Manejo de Errores (404)
Se ha configurado una ruta comodín o "catch-all" usando el path `*`. Si el usuario navega a una URL que no coincida con el mapa anterior (por ejemplo `/dieta`), React Router renderiza automáticamente el componente `NotFound.tsx`, asegurando que la aplicación no falle de forma silenciosa e indicándole al usuario cómo volver al flujo principal.


