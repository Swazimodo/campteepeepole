import { render, screen } from '@testing-library/react';
import { Embed, Image } from '@/components/mdxComponents';

test("Embed_withFloatLeft_hasFloatLeftClass", () => {
  render(<Embed src="https://example.com" title="form" float="left" width={500} />);

  expect(screen.getByTitle('form')).toHaveClass('float-left');
});

test("Image_withFloatRight_hasFloatRightClass", () => {
  render(<Image src="a.png" alt="cabin" float="right" />);

  expect(screen.getByAltText('cabin')).toHaveClass('float-right');
});
