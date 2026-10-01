import { render, screen } from '@testing-library/react';
import { Image } from '@/components/mdxComponents';

test("Image_withFloatRight_hasFloatRightClass", () => {
  render(<Image src="a.png" alt="cabin" float="right" />);

  expect(screen.getByAltText('cabin')).toHaveClass('float-right');
});
