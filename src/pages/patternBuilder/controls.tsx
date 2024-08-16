import { FC, useCallback, useState } from 'react';
import { useNumberField } from 'common/fieldHooks';

export const Controls: FC = () => {
  const [startingSymbol, setStartingSymbol] = useState<'x' | 'o'>('x')
  const numSymbolsInFirstGroup = useNumberField(1)
  const numSymbolsInSecondGroup = useNumberField(1)
  const numRowsToDuplicate = useNumberField(1)
  const numOfAlternatingChunks = useNumberField(1)
  const numOfAlternatingBlocks = useNumberField(1)

  const handleSymbolChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value !== 'x' && value !== 'o') {
      return
    }
    setStartingSymbol(value)
  }, [setStartingSymbol])

  return <div>
    Pattern creation controls
    <p>
      <div>starting symbol</div>
      <div><select value={startingSymbol} onChange={handleSymbolChange}>
        <option value={'x'}>x</option>
        <option value={'o'}>o</option>
      </select></div>
    </p>
    <p>
      <div>number of symbols per group 1</div>
      <div><input value={numSymbolsInFirstGroup.value} onChange={numSymbolsInFirstGroup.handleChange} /></div>
    </p>
    <p>
      <div>number of symbols per group 2</div>
      <div><input value={numSymbolsInSecondGroup.value} onChange={numSymbolsInSecondGroup.handleChange} /></div>
    </p>
    <p>
      <div>number of rows to duplicate</div>
      <div><input value={numRowsToDuplicate.value} onChange={numRowsToDuplicate.handleChange} /></div>
    </p>
    <p>
      <div>number of chunks to duplicate</div>
      <div><input value={numOfAlternatingChunks.value} onChange={numOfAlternatingChunks.handleChange} /></div>
    </p>
    <p>
      <div>number of blocks to duplicate</div>
      <div><input value={numOfAlternatingBlocks.value} onChange={numOfAlternatingBlocks.handleChange} /></div>
    </p>
  </div>
}
