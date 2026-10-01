interface EmbedProps {
  src: string,
  title: string,
  height?: number
}

export const Embed = ({ src, title, height = 600 }: EmbedProps) =>
  <iframe src={src} title={title} height={height} className="w-full my-4 border-0" />

interface ImageProps {
  src: string,
  alt: string,
  float?: 'left' | 'right',
  width?: number
}

const floatClasses = {
  left: 'float-left mr-4',
  right: 'float-right ml-4',
}

export const Image = ({ src, alt, float, width }: ImageProps) =>
  <img src={src} alt={alt} width={width} className={`mb-2 ${float ? floatClasses[float] : ''}`} />
