# New Next.js Page

Create a new page using Next.js App Router conventions.

## Requirements

- Create page in `src/app/[route]/page.tsx`
- Use Server Components by default
- Add metadata export for SEO
- Follow existing layout patterns

## Template

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${PageTitle} | Camp Teepee Pole',
  description: '${PageDescription}',
};

export default function ${PageName}Page() {
  return (
    <main className="">
      <h1>${PageTitle}</h1>
      {/* Page content */}
    </main>
  );
}
```

## Dynamic Routes

For dynamic routes, use the folder convention `[paramName]/page.tsx`:

```typescript
interface PageProps {
  params: Promise<{ paramName: string }>;
}

export default async function DynamicPage({ params }: PageProps) {
  const { paramName } = await params;
  return <div>{paramName}</div>;
}
```

## Checklist

- [ ] Page created in correct location
- [ ] Metadata exported for SEO
- [ ] Server/Client component directive if needed
- [ ] Proper TypeScript types
- [ ] Responsive design with Tailwind
