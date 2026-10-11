import AuthImage from '@/app/assets/bitewise.webp';
import { getImageProps } from 'next/image';

// Tailwind's `xl` breakpoint, the width from which the frame is shown.
const XL_MEDIA = '(min-width: 1280px)';
// A 1×1 transparent gif: the fallback below xl, so nothing is fetched there.
const EMPTY_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const AuthImageFrame = () => {
  // The image is the LCP element at xl, so it loads eagerly at high priority.
  // Browsers fetch eager images even inside a `display: none` parent, so the
  // real source is only offered to xl widths through `<picture>`.
  const {
    props: { srcSet, sizes, alt, ...imgProps },
  } = getImageProps({
    src: AuthImage,
    alt: 'Meal image',
    // At xl the frame is at most half of 1408px.
    sizes: '704px',
    loading: 'eager',
    fetchPriority: 'high',
  });

  return (
    <section className="hidden overflow-hidden xl:block xl:max-w-[50%] xl:rounded-r-lg">
      <picture>
        <source media={XL_MEDIA} srcSet={srcSet} sizes={sizes} />
        <img {...imgProps} alt={alt} src={EMPTY_IMAGE} />
      </picture>
    </section>
  );
};

export default AuthImageFrame;
