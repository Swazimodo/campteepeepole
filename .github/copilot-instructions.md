# GitHub Copilot Instructions

## Project Overview

This is a Next.js 16 application for Camp Teepee Pole, built with TypeScript, React 18, and Tailwind CSS 4. The project uses Jest for testing and integrates with AWS S3.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Testing**: Jest 30 with React Testing Library
- **Cloud**: AWS SDK (S3)
- **Linting**: ESLint with Next.js config

## Code Style Guidelines

### TypeScript

- Use strict TypeScript with explicit types for function parameters and return values
- Prefer interfaces over types for object shapes
- Use `const` assertions where appropriate
- Avoid `any` type - use `unknown` if the type is truly unknown

### React & Next.js

- Use functional components with hooks
- Prefer Server Components by default; only use `'use client'` when necessary
- Use Next.js App Router conventions (`page.tsx`, `layout.tsx`)
- Co-locate components with their pages when specific to that route
- Shared components go in `src/components/`

### File Organization

- Components use PascalCase: `SiteHeader.tsx`
- Utilities and hooks use camelCase: `siteConfig.tsx`
- Use barrel exports (`index.ts`) for component directories
- Keep test files adjacent to source: `component.test.tsx`

### Testing

- Write tests using Jest and React Testing Library
- Test files should be named `*.test.tsx` or `*.test.ts`
- Use `describe` blocks to group related tests
- Prefer user-centric testing (test behavior, not implementation)

### Styling

- Use Tailwind CSS utility classes
- Avoid inline styles; use Tailwind instead
- Keep component-specific styles co-located

## Project Structure

```
src/
  app/           # Next.js App Router pages
  components/    # Shared React components
  static/        # Static assets and configuration
tests/           # Integration and E2E tests
```

## Common Patterns

### Component Structure

```typescript
interface ComponentProps {
  title: string;
  children?: React.ReactNode;
}

export function Component({ title, children }: ComponentProps) {
  return (
    <div className="...">
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

### AWS S3 Integration

- Use the wrappers in `src/components/awsWrappers/s3.tsx`
- Handle errors gracefully with try-catch blocks

## Do's and Don'ts

### Do

- Use semantic HTML elements
- Add proper accessibility attributes (aria-labels, roles)
- Write descriptive commit messages
- Add JSDoc comments for complex functions
- Use Next.js Image component for images

### Don't

- Use `var` - use `const` or `let`
- Commit console.log statements
- Use inline styles when Tailwind classes exist
- Ignore TypeScript errors with `@ts-ignore`
- Use `any` type without explicit justification
