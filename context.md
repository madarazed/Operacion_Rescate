# Misión Rescate: Código PASR - Master Project Context v3 (Definitiva)

## 1. Visión General y Alcance (MVP)
**Objetivo:** Desarrollar una experiencia web interactiva y gamificada enfocada en la enseñanza de primeros auxilios para animales de la calle, basada en el protocolo PASR (Proteger, Alertar, Socorrer, Remitir).
**Público Objetivo:** Público general. 
**Enfoque de Desarrollo:** Mobile-First, alta accesibilidad, feedback visual inmediato y prevención de errores de usuario.

## 2. Stack Tecnológico Completo
### Frontend (Cliente)
- **Core:** React (18+) + Vite
- **Lenguaje:** TypeScript (Tipado estricto `strict: true` en `tsconfig.json`)
- **Enrutamiento:** React Router DOM (v6+)
- **Gestión de Estado:** Zustand
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion (Transiciones de ruta, alertas, drag & drop visual)
- **Interactividad Avanzada:** `@dnd-kit/core`
- **Peticiones HTTP:** Axios
- **Validación de Datos (Frontend):** Zod

### Backend (API REST)
- **Framework:** Laravel (11+)
- **Lenguaje:** PHP (8.2+)
- **Base de Datos:** PostgreSQL
- **Seguridad:** CORS configurado para el dominio del frontend, validación de Requests con FormRequests.

## 3. Convenciones de Código y Arquitectura
- **Nomenclatura (Frontend):** 
  - Componentes y Vistas: `PascalCase` (Ej: `GameContainer.tsx`).
  - Funciones y Hooks: `camelCase` (Ej: `useGameLogic.ts`).
  - Archivos de utilidad: `camelCase` (Ej: `scoreCalculator.ts`).
- **Nomenclatura (Backend):**
  - Tablas DB: `snake_case` plural (Ej: `game_sessions`).
  - Controladores: `PascalCase` singular (Ej: `SessionController.php`).
- **Manejo de Estados:** Prohibido el uso excesivo de `useState` locales para datos que deban persistir entre niveles. Usar Zustand.

## 4. Sistema de Diseño (UI/UX)
- **Tipografía:** Sans-serif legible (Inter o Roboto).
- **Paleta de Colores (Semáforo de Emergencias):**
  - `danger (ROJO)`: `#EF4444` (Para sangrados, alertas críticas, nivel 2).
  - `warning (AMARILLO)`: `#F59E0B` (Para fracturas, dolor intenso).
  - `safe (VERDE)`: `#10B981` (Para casos estables, aciertos).
  - `neutral`: Tonos grises y blancos para no distraer del contenido interactivo.
- **Feedback Visual:** Todo botón debe tener estados `:hover` y `:active`. Los errores deben incluir un `shake` (animación de temblor).

## 5. Manejo de Errores y Edge Cases
- **Timeout (Tiempo agotado):** Si el contador llega a 0 en cualquier nivel, el estado del juego cambia a `isGameOver: true` y muestra un modal de "Tiempo Agotado" con opción de reintentar el nivel.
- **Fallos de API:** Si el backend de Laravel falla al guardar el score, el frontend debe capturar el error (`try/catch`), guardar el score en `localStorage` como respaldo y mostrar un *toast* silencioso de advertencia, sin interrumpir la experiencia del usuario.
- **Prevención de Recargas:** Bloquear advertencias si el usuario intenta recargar la página a mitad del juego (evento `beforeunload`).

## 6. Variables de Entorno Requeridas (`.env`)
### Frontend
- `VITE_API_URL`: URL base del backend Laravel (Ej: `http://localhost:8000/api`).
### Backend
- `DB_CONNECTION=pgsql`
- `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `CORS_ALLOWED_ORIGINS`: URL del frontend de React.

## 7. Arquitectura de Directorios (Frontend `/src`)
```text
/src
 ├── /assets          # Imágenes optimizadas (PNG transparente), audios cortos (mp3/wav).
 ├── /components
 │    ├── /levels     # Level1.tsx, Level2.tsx, Level3.tsx, Level4.tsx
 │    ├── /ui         # Button.tsx, TimerDisplay.tsx, Modal.tsx, AlertBadge.tsx
 │    └── /layouts    # GameLayout.tsx (Maneja el fondo estático y envoltura principal)
 ├── /hooks           # useTimer.ts, useTriageDrag.ts
 ├── /store           # gameStore.ts (Zustand)
 ├── /services        # api.ts (Configuración de Axios), sessionService.ts
 ├── /types           # index.d.ts (Interfaces de estado, respuestas de API)
 ├── /utils           # formatters.ts, constants.ts (Tiempos máximos por nivel)
 └── App.tsx          # Enrutador y Providers
8. Lógica de Estado Global (Zustand - gameStore.ts)
TypeScript


interface GameState {
  currentLevel: number;
  score: number;
  globalTimer: number;
  playerData: { id: number | null; name: string };
  isGameOver: boolean;
  actions: {
    nextLevel: () => void;
    addScore: (points: number) => void;
    deductTime: (seconds: number) => void;
    triggerGameOver: (reason: string) => void;
    resetGame: () => void;
  }
}
9. Especificación Detallada de Niveles
Nivel 1: La Escena del Hallazgo (Fase PASR)
Mecánica: Selección múltiple tipo "Decide tu propia aventura".

Lógica Oculta: Seleccionar "Alzar de inmediato" ejecuta triggerGameOver("Mordedura por estrés"). Seleccionar "Evaluar entorno" otorga puntos y avanza.

Fase Alertar: Componente UI que simula un dial de teléfono.

Nivel 2: El Tablero de Triage de Campo
Mecánica: dnd-kit/core (Drag and Drop).

Entidades: 3 Tarjetas de Paciente generadas a partir de un array de objetos (sintomatología variada).

Zonas de Drop: Contenedores con los colores definidos en el Sistema de Diseño (Rojo, Amarillo, Verde).

Condición de Victoria: Las 3 tarjetas deben hacer match perfecto con su contenedor de gravedad.

Nivel 3: El Desafío del Reloj
Mecánica: Simulador Point-and-Click. Tiempo crítico (30-60s).

UI: Gráfico de un animal con 4 hotspots interactivos (Respira, Sangra, Consciente, Se mueve).

Regla Crítica: Un componente <UrgencyButton /> renderizado condicionalmente. Si el jugador hace clic en un hotspot con estado vital fallido y no presiona el botón de urgencia en los siguientes 5 segundos, pierde puntos o falla el nivel.

Nivel 4: Protocolos Rápidos (Hemorragias)
Mecánica: Inventario interactivo de curación.

Flujo Estricto:

Seleccionar Gasa -> Arrastrar a herida -> Renderizar Gasa manchada de sangre.

Pregunta Capciosa: ¿Retirar o Añadir encima? Si selecciona retirar: -50 puntos. Si selecciona añadir: +100 puntos y avanza a "Elevar extremidad".

10. Directivas Estrictas para el Asistente de IA (Antigravity Rules)
Tipado Obligatorio: Cero any. Cada prop de componente, respuesta de Axios y variable de estado debe tener su interface o type explícito en la carpeta /types.

Componentes Atómicos: No crear archivos monolíticos. Si un archivo pasa de las 200 líneas, debe refactorizarse en subcomponentes dentro de /components/ui.

Inmutabilidad: Jamás mutar objetos directamente en el estado. Usar funciones nativas de Zustand.

Separación de Responsabilidades (API): Los componentes de React NO deben tener lógica de fetch o llamadas a la API puras. Deben importar funciones asíncronas desde el directorio /services.

Animaciones como Feedback: Usar framer-motion para guiar la atención del usuario (ej. animar el botón de urgencia), no solo por estética.