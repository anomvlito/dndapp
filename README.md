# ⚔️ DnD Personaje — Ficha Digital de D&D 5e

Una **hoja de personaje interactiva** para D&D 5ª Edición, construida con React + Vite. Pensada para el personaje **Iteración**, un bárbaro humano con amnesia y un misterioso pacto latente.

---

## ✨ Características

- 📊 **Atributos editables** con cálculo automático de modificadores
- 🛡️ **Salvaciones y Habilidades** con toggle de competencias
- ❤️ **Sistema de HP** con vida temporal y salvaciones de muerte
- ⚔️ **Tabla de ataques** personalizable
- 🎲 **Lanzador de dados** flotante (d4, d6, d8, d10, d12, d20) con animaciones
- 📜 **Pestaña de Biografía** con el lore del personaje, equipo y monedas
- 📊 **Exportar a Excel** con todos los datos del personaje (usando SheetJS)
- 🖨️ **Imprimir a PDF** con estilos optimizados para impresión
- 🌀 **Animaciones** suaves entre pestañas gracias a Framer Motion

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| [React 19](https://react.dev/) | UI y lógica de estado |
| [Vite](https://vitejs.dev/) | Bundler y servidor de desarrollo |
| [Tailwind CSS v3](https://tailwindcss.com/) | Estilos utilitarios |
| [Framer Motion](https://www.framer.com/motion/) | Animaciones |
| [React Icons](https://react-icons.github.io/react-icons/) | Iconos de dados |
| [SheetJS (xlsx)](https://sheetjs.com/) | Exportación a Excel |

---

## 🚀 Instalación y Uso

### Requisitos
- Node.js v18 o superior
- npm

### Pasos

```bash
# 1. Clona el repositorio
git clone git@github.com:anomvlito/dndapp.git
cd dndapp

# 2. Instala las dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build para producción

```bash
npm run build
```

---

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── BioTab.jsx          # Pestaña de lore, equipo y monedas
│   ├── CharacterStats.jsx  # Bloque de atributos (FUE, DES, etc.)
│   ├── CombatPanel.jsx     # CA, HP, ataques, dados de golpe
│   ├── DiceTray.jsx        # Lanzador de dados flotante
│   ├── PersonalityPanel.jsx# Rasgos, pistas y features
│   └── SkillsPanel.jsx     # Habilidades y salvaciones
├── constants/
│   └── dndData.js          # Datos iniciales del personaje
├── utils/
│   ├── exportExcel.js      # Lógica de exportación XLSX
│   └── modifiers.js        # Cálculo de modificadores D&D
├── App.jsx                 # Componente raíz
├── App.css                 # Estilos del parchment y componentes
├── index.css               # Estilos globales y Tailwind
└── main.jsx                # Punto de entrada
```

---

## 🎲 Personaje: Iteración

> *"Despertó en el centro de un cráter sin saber quién era. Solo la palabra 'Iteración' resonaba en su mente como un eco constante."*

**Clase:** Bárbaro 1 | **Raza:** Humano (Variante) | **Estado:** Amnesia Total

El personaje lleva integrado el lore del **Pacto Silencioso (Serosh)**, una fiera latente que se manifiesta en momentos críticos.

---

## 📄 Licencia

MIT — Haz lo que quieras con el código.
