# Capa de Red y Cliente API (Frontend)

## 1. Arquitectura del Cliente
Para aislar la lógica de red de los componentes visuales de React, hemos implementado un cliente API centralizado en `src/api/client.ts`. Este módulo actúa como la única puerta de entrada y salida de datos hacia nuestro backend (Express).

## 2. Tipado Estricto (TypeScript)
El cliente define las interfaces exactas (`Macros`, `UserProfile`, `DashboardData`) que coinciden con el contrato del backend. Todas las funciones asíncronas (`getDashboard`, `addConsumedMacros`, etc.) están fuertemente tipadas devolviendo Promesas explícitas (`Promise<T>`). Esto elimina el uso de `any` y previene errores en tiempo de compilación.

## 3. Gestión de Estados en la UI
Para cumplir con los estándares de UX, el `MacroContext` envuelve las llamadas al `apiClient` gestionando tres estados de red fundamentales:
* **Loading:** Un booleano (`isLoading`) que muestra una pantalla de "Conectando al servidor..." mientras se resuelven las promesas HTTP iniciales.
* **Data (Éxito):** El estado normal donde los componentes consumen la información parseada en JSON.
* **Error:** Un capturador global que extrae el mensaje de error de la instancia HTTP (`err instanceof Error`) y bloquea la UI mostrando instrucciones claras si el backend está caído.