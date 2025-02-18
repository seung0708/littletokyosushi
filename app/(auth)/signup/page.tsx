import Signup from "@/components/auth/signup";
import { Suspense } from "react";

export default function SignupPage() {  
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
            <Suspense fallback={<div>Loading...</div>}>
                <Signup />
            </Suspense>
        </div>
    </div>
    )

}