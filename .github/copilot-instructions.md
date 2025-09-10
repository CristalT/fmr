# Copilot Instructions for FMR Project

## Project Overview
This is a Vue.js/Inertia.js application with AdonisJS backend for managing orders, customers, and inventory.

## Technology Stack
- **Frontend**: Vue 3 with TypeScript, Inertia.js
- **Backend**: AdonisJS 6 with TypeScript
- **Database**: MySQL with Lucid ORM
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Code Style Guidelines

### Vue Components
- Use Composition API with `<script setup lang="ts">`
- Prefer TypeScript interfaces for props
- Use `defineModel` for v-model bindings
- Import types with `type` keyword: `import type Category from '#models/category'`

### Styling
- Use Tailwind CSS classes primarily
- Place custom styles in `<style scoped>` blocks at the end of files
- Global text color is set to `text-gray-700` in tailwind config
- Prefer semantic class names for custom CSS

### Database
- Use Lucid migrations with proper foreign key constraints
- Ensure foreign key columns match referenced column types (use `.unsigned()` for auto-increment references)
- Follow naming convention: `table_name_column_foreign`

### File Structure
- Components in `/inertia/components/`
- Pages in `/inertia/pages/`
- Models in `/app/models/`
- Migrations in `/database/migrations/`
- Middleware in `/app/middleware/`

### Naming Conventions
- Vue components: PascalCase (e.g., `CategoriesTree.vue`)
- Files and directories: snake_case or kebab-case
- Database tables: plural snake_case (e.g., `cart_items`)
- Model properties: camelCase in TypeScript, snake_case in database

### Import Aliases
- `#models/` for model imports
- `~/` for inertia directory
- `#start/` for start directory

## Common Patterns

### Menu System
Uses a menu builder pattern with support for nested submenus:
```typescript
menu.addOption(
  { label: 'Parent', icon: 'icon' },
  (option) => {
    option.addSubOption({
      label: 'Child',
      action: () => router.visit('/path'),
      section: 'section'
    })
  }
)
```

### Form Validation
Use middleware for request validation, especially for external APIs like MercadoPago webhooks.

### Component Communication
- Use `defineModel` for two-way binding
- Emit events for parent-child communication
- Use Inertia router for navigation: `router.visit()` or `router.get()`

## Security Considerations
- Validate all external webhook requests (e.g., MercadoPago notifications)
- Use HMAC verification for webhook authenticity
- Proper error handling without exposing sensitive information

## Development Notes
- Prefer functional programming patterns with lodash-es utilities
- Use computed properties for derived state
- Extract complex logic into composables when reusable
- Keep components focused on single