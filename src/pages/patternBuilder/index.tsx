import { FC } from 'react';

import { Controls } from 'pages/patternBuilder/controls';
import { PatternDisplay } from 'pages/patternBuilder/patternDisplay';

export const PatternBuilder: FC = () => {
  return <>
    <Controls />
    <PatternDisplay />
  </>
}
