import ChangeEmail from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Security/ChangeEmail';
import ChangePassword from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Security/ChangePassword';

const Security = () => {
  return (
    <div className="space-y-8">
      <ChangeEmail />
      <ChangePassword />
    </div>
  );
};

export default Security;
