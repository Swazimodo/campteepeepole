# New Test File

Create a test file using Jest and React Testing Library.

## Requirements

- Use Jest 30 with React Testing Library
- Follow AAA pattern (Arrange, Act, Assert)
- Test behavior, not implementation details
- Use descriptive test names

## Template for Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ${ComponentName} } from './${componentName}';

describe('${ComponentName}', () => {
  it('should render correctly', () => {
    // Arrange
    render(<${ComponentName} />);

    // Act & Assert
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<${ComponentName} />);

    // Act
    await user.click(screen.getByRole('button'));

    // Assert
    expect(screen.getByText('...')).toBeVisible();
  });
});
```

## Template for Utility Tests

```typescript
import { ${functionName} } from './${fileName}';

describe('${functionName}', () => {
  it('should return expected result for valid input', () => {
    const result = ${functionName}(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle edge cases', () => {
    expect(() => ${functionName}(invalidInput)).toThrow();
  });
});
```

## Testing Queries Priority

1. `getByRole` - Most accessible
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Inputs
4. `getByText` - Non-interactive elements
5. `getByTestId` - Last resort

## Checklist

- [ ] Test file named `*.test.tsx` or `*.test.ts`
- [ ] Descriptive test names
- [ ] Tests behavior, not implementation
- [ ] Proper async/await for user events
- [ ] No implementation details tested
