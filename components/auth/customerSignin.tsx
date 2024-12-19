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
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function CustomerSignin() {
    const [error, setError] = useState<string | null>(null);
    const { signin, isLoading, googleSignin } = useAuth();
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: FormData) {
        try {
            await signin(data.email, data.password); 
            // Redirect to admin dashboard on successful login    
            router.push("/");
            router.refresh();
        } catch (error: any) {
            console.error("Login error:", error);   
            setError(error instanceof Error ? error.message : "Failed to login");
        }   
    }

    async function handleGoogleSignin() {
        try {
            await googleSignin();
            // Redirect to admin dashboard on successful login    
        } catch (error: any) {
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
                {error && <p className="text-red-500">{error}</p>}
                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Login"}
                </Button>
            </form>
            <div className="mt-4">
                <Link href='/signup' className="text-blue-500 hover:underline">
                    Don't have an account?
                </Link>
                
                <Link href='/forgot-password' className="text-blue-500 hover:underline ml-2">
                    Forgot Password?
                </Link>
            </div>
        </Form>
        <hr className="my-4" />  
        <div className="flex items-center justify-center mt-4">
        <Button variant={"outline"} type="button" onClick={handleGoogleSignin}>
            <Image src="/google.svg" alt="Google Logo" width={20} height={20} /> Login with Google
        </Button>
        </div>
    </>
    );
}