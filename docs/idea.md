# Idea del Proyecto: MacroSolver AI

## El Problema
Las aplicaciones de nutrición actuales son pasivas, generan frustración y no contemplan la psicología del usuario. Las personas abandonan sus dietas porque no saben cómo cuadrar sus macros con los ingredientes que tienen en casa, se aburren de comer lo mismo y sienten culpa extrema cuando cometen un error o tienen un antojo.

## Usuario Objetivo
Estudiantes, programadores y oficinistas de entre 18 y 35 años que quieren cuidar su alimentación o cumplir objetivos físicos (gimnasio), pero que tienen poco tiempo para cocinar, bajo presupuesto y no quieren renunciar a la salud mental ni castigarse por sus antojos.

## Funcionalidades Principales (MVP)
1.  **Cálculo Matemático de Macros:** Un motor que recibe los ingredientes disponibles y los macros objetivos, devolviendo la cantidad exacta en gramos de cada alimento usando algoritmos (Programación Lineal).
2.  **Chef IA (Generación de Recetas):** Consumo de una API de Inteligencia Artificial para generar una receta estructurada basada únicamente en los gramos calculados.
3.  **Botón de Pánico (Recalibrador de Culpa):** Funcionalidad que permite al usuario registrar un "capricho" (ej. un dulce) y recalcula automáticamente los macros restantes del día.
4.  **Gestión de Inventario Local:** Sistema para añadir, editar y eliminar los ingredientes disponibles en la nevera del usuario.

## Funcionalidades Opcionales (Bonus)
1.  **Salvavidas de Antojos:** Modificador de recetas que fuerza a la IA a buscar texturas específicas (crujiente, fast-food, dulce) con ingredientes básicos.
2.  **Fridge Vision (Escáner):** Integración de la cámara del dispositivo y una API de visión artificial para detectar automáticamente los ingredientes de la nevera.
3.  **Soporte PWA:** Posibilidad de instalar la aplicación web en el móvil como si fuera nativa.

## Mejoras Futuras
*   Integración con APIs de supermercados reales para calcular el precio exacto del plato.
*   Sistema de "Batch Cooking" para planificar las recetas de toda la semana de forma encadenada.
*   Autenticación de usuarios completa (JWT) con base de datos real para guardar el histórico de peso y progresos.