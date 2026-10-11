import AuthImage from '@/app/assets/bitewise.webp';
import Image from 'next/image';

const AuthImageFrame = () => {
  return (
    <section className="hidden overflow-hidden xl:block xl:max-w-[50%] xl:rounded-r-lg">
      {/* Hidden below xl; at xl the frame is at most half of 1408px. */}
      <Image src={AuthImage} alt="Meal image" sizes="704px" />
    </section>
  );
};

export default AuthImageFrame;
