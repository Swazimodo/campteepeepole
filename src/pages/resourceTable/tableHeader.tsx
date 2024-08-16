import { FC, useCallback } from "react"
import styled from 'styled-components'

import { useMediaQuery, MediaSizes } from "common"
import { RowDiv } from 'pages/resourceTable/tableRow'
import { TableCellDiv } from 'pages/resourceTable/tableCell'
import { SortColumn, SortDirection } from 'pages/resourceTable/tableState'

interface TableHeaderProps {
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSortChange: (sortColumn: SortColumn, sortDirection: SortDirection) => void
}

export const TableHeaderRow: FC<TableHeaderProps> = (props) => {
  const { matchesUp } = useMediaQuery(MediaSizes.sm);

  // hide the header on mobile
  if (!matchesUp) {
    return null;
  }

  return <RowDiv>
    <TableHeaderCell
      selectedSortColumn={props.sortColumn}
      sortColumn={'id'}
      sortDirection={props.sortDirection}
      onHeaderCellClick={props.onSortChange}
    >Id</TableHeaderCell>
    <TableHeaderCell
      selectedSortColumn={props.sortColumn}
      sortColumn={'title'}
      sortDirection={props.sortDirection}
      onHeaderCellClick={props.onSortChange}
    >Name</TableHeaderCell>
    <TableHeaderCell
      selectedSortColumn={props.sortColumn}
      sortColumn={'createdOn'}
      sortDirection={props.sortDirection}
      onHeaderCellClick={props.onSortChange}
    >Created On</TableHeaderCell>
    <TableCellDiv />
  </RowDiv>
}

interface TableHeaderCellProps {
  selectedSortColumn: SortColumn
  sortColumn: SortColumn
  sortDirection: SortDirection
  onHeaderCellClick: (sortColumn: SortColumn, sortDirection: SortDirection) => void
  children?: React.ReactNode
}

const TableHeaderCell: FC<TableHeaderCellProps> = (props) => {
  const {
    selectedSortColumn,
    sortColumn,
    sortDirection,
    onHeaderCellClick,
    children
  } = props

  const isSelectedSort = selectedSortColumn === sortColumn
  const handleClick = useCallback(() => {
    if (!isSelectedSort || (sortDirection === 'desc')) {
      onHeaderCellClick(sortColumn, 'asc')
    } else {
      onHeaderCellClick(sortColumn, 'desc')
    }
  }, [onHeaderCellClick, sortColumn, sortDirection, isSelectedSort])

  return <TableCellDiv>
    <TableHeaderCellButton onClick={handleClick}>
      {children}
      {(isSelectedSort && sortDirection === 'asc') && " ^"}
      {(isSelectedSort && sortDirection === 'desc') && " v"}
    </TableHeaderCellButton>
  </TableCellDiv>
}

const TableHeaderCellButton = styled.button`
  font-weight: bold;

  border: none;
  background: unset;
  padding: 0;
`
