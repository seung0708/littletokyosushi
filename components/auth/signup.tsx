'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(32, "Password cannot exceed 32 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Pointing to the field causing the error
    message: "Passwords must match",
});
    

type FormData = z.infer<typeof formSchema>;

export default function Signup() {
    const [error, setError] = useState<string | null>(null);
    const { signup, isLoading, googleSignin } = useAuth();
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: FormData) {
        try {
            await signup(data.email, data.password); 
            // Redirect to admin dashboard on successful login    
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Login error:", error);   
            setError(error instanceof Error ? error.message : "Failed to login");
        }   
    }

    async function handleGoogleSignin() {
        try {
            await googleSignin();
            // Redirect to admin dashboard on successful login    
        } catch (error) {
            console.error("Login error:", error);   
            setError(error instanceof Error ? error.message : "Failed to login");
        }   
    }

    return (
        <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    {...field}
                                />  
                            </FormControl>
                            <FormMessage /> 
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Confirm your password"
                                    {...field}
                                />  
                            </FormControl>
                            <FormMessage /> 
                        </FormItem>
                    )}
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Sign Up"}
                </Button>
            </form>
            <div className="mt-4">
                <Link href='/signin' className="text-blue-500 hover:underline">
                    Have an account?
                </Link>
                <Button variant={"outline"} type="button" onClick={handleGoogleSignin}>
                    <Image src="/google.svg" alt="Google Logo" width={20} height={20} />
                </Button>
            </div>
        </Form>
        <hr className="my-4" />  
        <div className="flex items-center justify-center mt-4">
       
        </div>
    </>
    );
}