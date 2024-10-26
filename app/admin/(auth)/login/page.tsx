import { LoginForm } from '../components/loginform';

interface LoginPageProps {
    onSignIn: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({onSignIn}) => {

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-sm mx-auto p-6">
                <div className='flex flex-col space-y-1.5 p-6'>
                    <h3 className='text-2xl font-semibold leading-none tracking-tight'>Login</h3>
                    <p className='text-sm text-muted-foreground'>Enter your email below to login to your account.</p>
                </div>
                <LoginForm  onSignIn={onSignIn} />
            </div>
        </div>
    )
}

export default LoginPage;