import { readdir, readFile } from 'node:fs/promises'
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'

const contentDir = 'src/content'

export interface Tab {
  path: string,
  title: string
}

/**
 * Compiles `src/content/<tab>/<page>.mdx`. `page` defaults to the tab's `index`.
 */
export const loadPage = async (tab: string, page = 'index') => {
  const source = await readFile(`${contentDir}/${tab}/${page}.mdx`, 'utf8')
  return evaluate(source, { ...runtime, baseUrl: import.meta.url })
}

/**
 * Each folder in `src/content` is a tab. Its `index.mdx` exports `title` and `order`.
 * Tabs sort by `order`, then by folder name.
 */
export const loadTabs = async (): Promise<Tab[]> => {
  const entries = await readdir(contentDir, { withFileTypes: true })
  const tabs = await Promise.all(entries.filter(x => x.isDirectory()).map(async ({ name }) => {
    const { title, order } = await loadPage(name)
    return {
      path: name,
      title: typeof title === 'string' ? title : name,
      order: typeof order === 'number' ? order : Infinity
    }
  }))
  return tabs
    .sort((a, b) => a.order - b.order || a.path.localeCompare(b.path))
    .map(({ path, title }) => ({ path, title }))
}

/**
 * Route params for every page: `page` is empty for a tab's `index.mdx`, otherwise the file name.
 */
export const listPages = async () => {
  const tabs = await loadTabs()
  const pages = await Promise.all(tabs.map(async ({ path: tab }) => {
    const files = await readdir(`${contentDir}/${tab}`)
    const names = files.filter(x => x.endsWith('.mdx')).map(x => x.slice(0, -'.mdx'.length))
    return names.map(name => ({ tab, page: name === 'index' ? [] : [name] }))
  }))
  return pages.flat()
}
