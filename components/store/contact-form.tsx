'use client';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const contactFormSchema = z.object({
    email: z.string().email('Invalid email format'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(1, 'Message is required')
});

const ContactForm: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const form = useForm<z.infer<typeof contactFormSchema>>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            email: '',
            subject: '',
            message: ''
        }
    });

    async function onSubmit(values: z.infer<typeof contactFormSchema>) {
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                setSubmitStatus('success');
                form.reset();
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
            console.error('Error sending email:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium">Email</FormLabel>
                            <FormControl>
                                <Input 
                                    type="email"
                                    className="w-full p-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow bg-white/5 backdrop-blur-sm" 
                                    placeholder="name@email.com"
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium">Subject</FormLabel>
                            <FormControl>
                                <Input 
                                    {...field} 
                                    className="w-full p-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow bg-white/5 backdrop-blur-sm"
                                    placeholder="What's this about?"
                                />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium">Message</FormLabel>
                            <FormControl>
                                <Textarea 
                                    {...field} 
                                    className="w-full min-h-[120px] p-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow bg-white/5 backdrop-blur-sm resize-y" 
                                    placeholder="Your message here..."
                                />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                    )}
                />

                <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        'Send Message'
                    )}
                </Button>

                {submitStatus === 'success' && (
                    <p className="text-sm text-green-500 text-center">Message sent successfully!</p>
                )}
                {submitStatus === 'error' && (
                    <p className="text-sm text-red-500 text-center">Failed to send message. Please try again.</p>
                )}
            </form>
        </Form>
    );
}

export default ContactForm;