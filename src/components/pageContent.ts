import { readFile } from 'node:fs/promises'

/**
 * Loads a page's MDX source from `CONTENT_BASE_URL` when set, otherwise from `src/content`.
 */
export const loadPageContent = async (path: string) => {
  const baseUrl = process.env.CONTENT_BASE_URL
  if (!baseUrl)
    return readFile(`src/content/${path}.mdx`, 'utf8')

  const response = await fetch(`${baseUrl}/${path}.mdx`)
  if (!response.ok)
    throw new Error(`Content for "${path}" not found: ${response.status}`)
  return response.text()
}
