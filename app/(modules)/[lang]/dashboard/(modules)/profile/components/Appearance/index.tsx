import Language from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Appearance/Language';
import Theme from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Appearance/Theme';

const Appearance = () => {
  return (
    <div className="flex flex-col">
      <Language />
      <Theme />
    </div>
  );
};

export default Appearance;
