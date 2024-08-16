import { useCallback, useMemo, useState } from 'react';

import { willSucceed, sortByText, sortByValue } from 'common';
import { ResourceDetails } from 'pages/resourceTable/tableRowState'

export type SortColumn = 'title' | 'id' | 'createdOn'
export type SortDirection = 'asc' | 'desc'

export const useResourceTableData = () => {
  const [resources, setResources] = useState<ResourceDetails[]>([]);
  const [sortColumn, setSortColumn] = useState<SortColumn>('title')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [isLoading, setIsLoading] = useState(true)

  useMemo(() => loadData().then((data) => {
    setResources(applySort(data, 'title', 'asc'))
    setSortColumn('title')
    setSortDirection('asc')
    setIsLoading(false)
  }), []);

  const handleSortChange = useCallback((sortColumn: SortColumn, sortDirection: SortDirection) => {
    setSortColumn(sortColumn)
    setSortDirection(sortDirection)
    setResources(applySort([...resources], sortColumn, sortDirection))
  }, [resources, setSortColumn, setSortDirection])

  const handleDeleteRow = useCallback((id: string) => {
    setResources(resources.filter((r) => r.id !== id))
  }, [resources])

  const handleAddRow = useCallback((resource: ResourceDetails) => {
    setResources([...resources, resource])
  }, [resources])

  return {
    resources,
    sortColumn,
    sortDirection,
    isLoading,
    handleDeleteRow,
    handleAddRow,
    handleSortChange
  }
}

const loadData: () => Promise<ResourceDetails[]> = () => {
  return willSucceed()
    .then(() => [{
      id: "r1",
      name: "First item",
      createdOn: new Date('2000-02-01')
    }, {
      id: "r2",
      name: "Second item",
      createdOn: new Date('2001-02-02')
    }, {
      id: "r3",
      name: "Third item",
      createdOn: new Date('2005-02-03')
    }, {
      id: "r4",
      name: "Fourth item",
      createdOn: new Date('2003-02-04')
    }])
}

const applySort = (resources: ResourceDetails[], sortOrder: SortColumn, sortDirection: SortDirection) => {
  const order = sortDirection === 'asc' ? 1 : -1
  if (sortOrder === 'title') {
    return resources.sort((a, b) => sortByText(a.name, b.name) * order)
  }
  else if (sortOrder === 'createdOn') {
    return resources.sort((a, b) => sortByValue(a.createdOn, b.createdOn) * order)
  }
  else {
    return resources.sort((a, b) => sortByText(a.id, b.id) * order)
  }
}
