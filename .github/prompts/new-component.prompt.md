# New Component

Create a new React component following project conventions.

## Requirements

- Use TypeScript with proper interface definitions
- Follow functional component patterns with hooks
- Use Tailwind CSS for styling
- Include proper accessibility attributes
- Export from an index.ts barrel file if in a directory

## Template

```typescript
interface ${ComponentName}Props {
  // Define props here
}

export function ${ComponentName}({ ...props }: ${ComponentName}Props) {
  return (
    <div className="">
      {/* Component content */}
    </div>
  );
}
```

## Checklist

- [ ] Props interface defined
- [ ] Proper TypeScript types
- [ ] Tailwind CSS classes used
- [ ] Accessibility attributes added
- [ ] Component exported properly
