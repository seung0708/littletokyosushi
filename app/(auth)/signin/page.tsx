'use client';
import AdminSignin from "@/components/auth/adminSignin";
import CustomerSignin from "@/components/auth/customerSignin";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <div className="text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-[48rem] space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold">Admin Sign in</h2>
                </div>
                <AdminSignin />
            </div>
            {/* {isAdmin && (
                <div>
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold">Customer Sign in</h2>
                    </div>
                    <CustomerSignin />
                </div>
            )}  */}
            {/* // : (
            //     <div className="max-w-md w-[48rem] space-y-8">
            //         <div>
            //             <h2 className="mt-6 text-center text-3xl font-extrabold">
            //                 Sign in to your account
            //             </h2>
            //         </div>
            //         <CustomerSignin/>
            //     </div>
            // ) */}
        </div>
    );
}