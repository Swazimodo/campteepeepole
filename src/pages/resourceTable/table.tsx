import { FC, useCallback, useState } from 'react';
import styled from 'styled-components'

import { ResourceTableRow } from 'pages/resourceTable/tableRow'
import { ResourceDetails } from 'pages/resourceTable/tableRowState'
import { useResourceTableData } from 'pages/resourceTable/tableState';
import { TableHeaderRow } from 'pages/resourceTable/tableHeader';
import { MediaSizes, getMinWidthQuery } from 'common';

export const ResourceTable: FC = () => {
  const { resources, sortColumn, sortDirection, isLoading, handleAddRow, handleDeleteRow, handleSortChange } = useResourceTableData()
  const [isAddingRow, setIsAddingRow] = useState(false)

  const handleShowNewRow = useCallback(() => setIsAddingRow(true), [])
  const handleSaveNewRow = useCallback((resource: ResourceDetails) => {
    setIsAddingRow(false)
    handleAddRow(resource)
  }, [handleAddRow])

  return <section>
    {isLoading && <>loading gif!!</>}
    {!isLoading && <TableWrapperDiv>
      <button onClick={handleShowNewRow}>Add new resource</button>
      <TableDiv>
        <TableHeaderRow
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
        />
        {resources.map((r, i) => <ResourceTableRow
          details={r}
          onSaveRow={handleSaveNewRow}
          onDeleteRow={handleDeleteRow}
          key={r.id}
        />)}
        {isAddingRow && <ResourceTableRow onSaveRow={handleSaveNewRow} onDeleteRow={handleDeleteRow} />}
      </TableDiv>
    </TableWrapperDiv>}
  </section>
}

const TableWrapperDiv = styled.div`
  margin: 24px;
`

const TableDiv = styled.div`
  display: flex;
  flex-direction: column;

  @media ${getMinWidthQuery(MediaSizes.sm)} {
    display: table;
    margin: 0 auto;
  }
`
