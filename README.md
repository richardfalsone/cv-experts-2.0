# Room of Experts — Sistema de Gestión IA

Este proyecto es un sistema de portafolios dinámicos gestionados por IA, diseñado para ser impecable tanto en su estética como en su arquitectura técnica.

## 📁 Estructura del Proyecto

El repositorio está organizado como un sistema dual:

1.  **Portafolio (Raíz)**: La aplicación pública que renderiza los CVs de los expertos con animaciones de alta calidad y el Asistente de IA integrado.
2.  **CV CMS (`/cv-cms`)**: El panel de administración desde donde se gestionan los bloques, el contenido y la personalidad de la IA para cada experto.

## 🚀 Guía de Despliegue (Vercel / GitHub)

Para asegurar que la comunicación entre el CMS y el Portafolio sea fluida, sigue estos pasos:

### 1. Desplegar el Portafolio (Público)
*   Conecta la raíz de este repo a un nuevo proyecto en Vercel.
*   **Command**: `npm run build`
*   **Output Directory**: `dist`
*   **Variables de Entorno**:
    *   `VITE_GEMINI_API_KEY`: Tu clave de Google AI Studio.
    *   `VITE_CMS_URL`: La URL final de tu despliegue del CMS (ej. `https://cms-richard.vercel.app`).

### 2. Desplegar el CMS (Admin)
*   Crea un SEGUNDO proyecto en Vercel apuntando al mismo repo, pero establece el **Root Directory** a `cv-cms`.
*   **Command**: `npm run build` (dentro de `cv-cms`)
*   **Output Directory**: `dist`
*   **Variables de Entorno**:
    *   `VITE_PORTFOLIO_URL`: La URL del portafolio público (ej. `https://richard-falsone.vercel.app`).

## 🛠️ Optimización y Calidad

*   **Tipos Compartidos**: El sistema utiliza un archivo centralizado `src/types/cv.types.ts` para garantizar coherencia total.
*   **Sincronización Live**: El editor utiliza `postMessage` para actualizar la vista previa en tiempo real sin recargas de página.
*   **Seguridad**: Ambos sistemas están protegidos por validaciones de origen dinámicas.

---
*Desarrollado con obsesión por el diseño y la ingeniería impecable.*
