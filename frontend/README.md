# Note Organizer

A beautiful, modern note-taking application built with React 19, TypeScript, and Tailwind CSS. Organize your thoughts with an elegant interface featuring categories, search, and a responsive design.

## ✨ Features

### Core Functionality

-   **📝 Note Management**: Create, edit, and view notes with a clean interface
-   **🗂️ Categories**: Organize notes into categories for better management
-   **🔍 Search**: Find notes quickly by title, content, or tags
-   **🏷️ Tags**: Add multiple tags to notes for enhanced organization
-   **👤 Author Tracking**: Track who created each note
-   **📅 Timestamps**: Automatic creation and update timestamps

### User Experience

-   **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
-   **🎨 Beautiful UI**: Modern design with warm gradients and smooth animations
-   **⚡ Fast Performance**: Built with React 19 for optimal performance
-   **🎯 Intuitive Navigation**: Easy-to-use interface with collapsible sidebar
-   **✨ Smooth Animations**: Elegant transitions and hover effects

### Technical Features

-   **🔒 TypeScript**: Full type safety throughout the application
-   **🎨 Design System**: Consistent theming with CSS custom properties
-   **📦 Component Architecture**: Modular, reusable components
-   **🚀 Modern Stack**: React 19, Vite, Tailwind CSS

## 🛠️ Tech Stack

-   **Frontend**: React 19, TypeScript
-   **Styling**: Tailwind CSS, CSS Custom Properties
-   **Build Tool**: Vite
-   **UI Components**: Custom components with shadcn/ui base
-   **Icons**: Lucide React
-   **State Management**: React Hooks (useState, useEffect)

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+ and npm installed
-   Git for version control

### Installation

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd note-organizer
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Start the development server**

    ```bash
    npm run dev
    ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to see the application

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── header.tsx          # Main application header
│   ├── notes/
│   │   ├── note-editor.tsx     # Note creation/editing form
│   │   └── note-grid.tsx       # Notes display grid
│   └── ui/
│       ├── category-sidebar.tsx # Category management sidebar
│       ├── note-card.tsx       # Individual note card
│       ├── search-bar.tsx      # Search functionality
│       └── [shadcn components] # Base UI components
├── pages/
│   ├── Index.tsx              # Main dashboard page
│   └── NotFound.tsx           # 404 error page
├── lib/
│   └── utils.ts               # Utility functions
├── hooks/
│   └── use-toast.ts           # Toast notification hook
├── index.css                  # Design system & global styles
└── main.tsx                   # Application entry point
```

## 🎨 Design System

The application uses a sophisticated design system with:

-   **Color Palette**: Warm oranges and ambers with soft grays
-   **Typography**: Clean, readable fonts with proper hierarchy
-   **Spacing**: Consistent spacing scale using Tailwind
-   **Shadows**: Elegant card shadows with primary color tints
-   **Animations**: Smooth transitions and hover effects
-   **Gradients**: Beautiful gradient overlays for visual appeal

### CSS Custom Properties

All colors and design tokens are defined in `src/index.css` using HSL values for better color manipulation and theming.

## 🔧 Component Guide

### NoteCard

Displays individual notes with:

-   Title and content preview
-   Category badge
-   Author and date information
-   Tags display
-   Hover animations

### CategorySidebar

Manages note categories with:

-   Category list with note counts
-   Add new category functionality
-   Search categories
-   Active category highlighting

### NoteEditor

Full-featured note editor with:

-   Title and content editing
-   Category selection
-   Tag management
-   Author assignment
-   Save/cancel actions

### SearchBar

Advanced search functionality:

-   Real-time search input
-   Search by title, content, or tags
-   Clear search option

## 🚦 Future Backend Integration

This frontend is designed to easily integrate with a REST API backend:

### API Endpoints (Planned)

```
GET    /api/notes              # Fetch all notes
POST   /api/notes              # Create new note
GET    /api/notes/:id          # Fetch specific note
PUT    /api/notes/:id          # Update note
DELETE /api/notes/:id          # Delete note

GET    /api/categories         # Fetch all categories
POST   /api/categories         # Create new category
PUT    /api/categories/:id     # Update category
DELETE /api/categories/:id     # Delete category

GET    /api/search?q=query     # Search notes
```

### Data Models (TypeScript Interfaces)

```typescript
interface Note {
    id: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    author: string;
    tags?: string[];
}

interface Category {
    id: string;
    name: string;
    count: number;
    color?: string;
}
```

## 📱 Features in Detail

### Note Management

-   Create notes with rich text content
-   Edit existing notes with autosave capability
-   Delete notes with confirmation
-   Duplicate notes for templates

### Category System

-   Create custom categories
-   Assign notes to categories
-   Filter notes by category
-   Category-based note counts

### Search & Filter

-   Full-text search across titles and content
-   Tag-based filtering
-   Combined category and search filtering
-   Clear all filters option

### Responsive Design

-   Mobile-first approach
-   Collapsible sidebar on smaller screens
-   Touch-friendly interface
-   Optimized for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   [shadcn/ui](https://ui.shadcn.com/) for the base component library
-   [Lucide](https://lucide.dev/) for the beautiful icons
-   [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
-   [Vite](https://vitejs.dev/) for the fast build tool

---

Built with ❤️ using React 19 and TypeScript
