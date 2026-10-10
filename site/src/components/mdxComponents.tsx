type Float = 'left' | 'right'

const floatClasses = {
  left: 'float-left mr-4',
  right: 'float-right ml-4',
}

interface EmbedProps {
  src: string,
  title: string,
  height?: number,
  float?: Float,
  width?: number
}

export const Embed = ({ src, title, height = 600, float, width }: EmbedProps) =>
  <iframe
    src={src}
    title={title}
    height={height}
    width={width}
    sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox"
    referrerPolicy="strict-origin-when-cross-origin"
    loading="lazy"
    className={`my-4 border-0 ${float ? floatClasses[float] : 'w-full'}`}
  />

interface ImageProps {
  src: string,
  alt: string,
  float?: Float,
  width?: number
}

export const Image = ({ src, alt, float, width }: ImageProps) =>
  <img src={src} alt={alt} width={width} className={`mb-2 ${float ? floatClasses[float] : ''}`} />
