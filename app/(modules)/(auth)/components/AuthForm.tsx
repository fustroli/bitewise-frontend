import { Alert, AlertDescription } from '@/app/components/ui/alert';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';

import { EAuthView } from '@/app/(modules)/(auth)/enum';
import FacebookIcon from '@/app/components/icons/FacebookIcon';
import GoogleIcon from '@/app/components/icons/GoogleIcon';
import { Separator } from '@/app/components/ui/separator';
import SignInForm from '@/app/(modules)/(auth)/components/SignInForm';
import SignUpForm from '@/app/(modules)/(auth)/components/SignUpForm';
import SocialLogin from '@/app/(modules)/(auth)/components/SocialLogin';

interface IProps {
  /** Shown above the form, e.g. why the previous Session ended. */
  notice?: string;
}

const AuthForm = ({ notice }: IProps) => {
  return (
    <section className="md:max-w-4/5 flex h-screen flex-col items-center justify-around px-8 md:mx-auto xl:max-h-[704px] xl:rounded-l-lg xl:bg-card xl:px-16 xl:shadow-soft">
      <div className="text-2xl font-bold tracking-tight">
        BiteWise<span className="text-primary">.</span>
      </div>
      <h1 className="text-2xl font-bold xl:text-3xl">Welcome Back</h1>
      <div>Welcome back, please enter your details</div>
      {notice && (
        <Alert>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue={EAuthView.SIGN_IN}>
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value={EAuthView.SIGN_IN}>Sign In</TabsTrigger>
          <TabsTrigger value={EAuthView.SIGN_UP}>Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value={EAuthView.SIGN_IN}>
          <SignInForm />
        </TabsContent>
        <TabsContent value={EAuthView.SIGN_UP}>
          <SignUpForm />
        </TabsContent>
      </Tabs>

      <div className="flex w-full items-center">
        <Separator className="shrink" />
        <p className="mx-4 shrink-0">Or continue with</p>
        <Separator className="shrink" />
      </div>
      <div className="space-x-4">
        <SocialLogin url="/auth/facebook/login">
          <FacebookIcon />
        </SocialLogin>
        <SocialLogin url="/auth/google/login">
          <GoogleIcon />
        </SocialLogin>
      </div>
      <div className="text-center text-xs">
        BiteWise is your smart meal planner: combine your ingredients into
        meals, group meals into meal plans, and see the nutrition of each.
      </div>
    </section>
  );
};

export default AuthForm;
