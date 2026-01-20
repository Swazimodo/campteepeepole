# Refactor Code

Improve code quality without changing functionality.

## Refactoring Goals

- Improve readability and maintainability
- Reduce code duplication (DRY)
- Improve type safety
- Optimize performance where meaningful
- Follow project conventions

## Common Refactoring Patterns

### Extract Component

```typescript
// Before: Large component with embedded logic
function LargeComponent() {
  return (
    <div>
      <div className="header">...</div>
      <div className="content">...</div>
    </div>
  );
}

// After: Extracted sub-components
function Header() {
  return <div className="header">...</div>;
}

function LargeComponent() {
  return (
    <div>
      <Header />
      <Content />
    </div>
  );
}
```

### Extract Custom Hook

```typescript
// Before: Repeated state logic
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
useEffect(() => {
  /* fetch logic */
}, []);

// After: Custom hook
function useFetchData(url: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // ...
  return { data, loading };
}
```

### Improve Type Safety

```typescript
// Before: Loose typing
function process(data: any) { ... }

// After: Strict typing
interface ProcessData {
  id: string;
  value: number;
}
function process(data: ProcessData) { ... }
```

## Checklist

- [ ] All tests pass before refactoring
- [ ] Refactoring changes no external behavior
- [ ] All tests pass after refactoring
- [ ] Code is more readable/maintainable
- [ ] No new technical debt introduced
