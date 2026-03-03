# Fix Bug

Debug and fix an issue in the codebase.

## Approach

1. **Understand the bug**: What is the expected behavior vs actual behavior?
2. **Reproduce**: Can you consistently reproduce the issue?
3. **Locate**: Find the relevant code causing the issue
4. **Root cause**: Identify why the bug occurs
5. **Fix**: Implement the minimal change to fix the issue
6. **Test**: Verify the fix and ensure no regressions

## Debugging Steps

### For Runtime Errors

```typescript
// Add temporary logging to trace execution
console.log("[DEBUG] Variable state:", variable);

// Check for null/undefined
if (!value) {
  console.error("[DEBUG] Unexpected null value");
}
```

### For TypeScript Errors

- Check type definitions match actual data
- Verify imports are correct
- Ensure generics are properly constrained

### For React Rendering Issues

- Check component props and state
- Verify useEffect dependencies
- Check for infinite render loops

## Fix Template

```typescript
// Before: Description of buggy code
const buggyCode = ...;

// After: Description of fix
const fixedCode = ...;
```

## Checklist

- [ ] Bug reproduced and understood
- [ ] Root cause identified
- [ ] Minimal fix implemented
- [ ] Existing tests pass
- [ ] New test added to prevent regression
- [ ] No console.log statements left in code
