import BasicInfo from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Profile/BasicInfo';
import BodyStats from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Profile/BodyStats';
import DeleteAccount from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Profile/DeleteAccount';
import PersonalInformation from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Profile/PersonalInformation';
import SocialProfiles from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Profile/SocialProfiles';

const Profile = () => {
  return (
    <div className="flex flex-col">
      <BasicInfo />
      <PersonalInformation />
      <BodyStats />
      <SocialProfiles />
      <DeleteAccount />
    </div>
  );
};

export default Profile;
