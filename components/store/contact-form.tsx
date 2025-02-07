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
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                    <div className="space-y-4 sm:space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base sm:text-lg">Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="your@email.com" 
                                            {...field} 
                                            className="h-11 sm:h-12 text-base transition-all focus:ring-2 focus:ring-offset-2"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base sm:text-lg">Subject</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="What's this about?" 
                                            {...field} 
                                            className="h-11 sm:h-12 text-base transition-all focus:ring-2 focus:ring-offset-2"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base sm:text-lg">Message</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Your message here..." 
                                            {...field}
                                            className="min-h-[150px] text-base transition-all focus:ring-2 focus:ring-offset-2 resize-y"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col space-y-4">
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-8 h-11 sm:h-12 text-base font-semibold transition-all hover:scale-[1.02]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Message'
                            )}
                        </Button>

                        {submitStatus === 'success' && (
                            <p className="text-green-500 text-sm sm:text-base animate-fadeIn">
                                Message sent successfully!
                            </p>
                        )}
                        {submitStatus === 'error' && (
                            <p className="text-red-500 text-sm sm:text-base animate-fadeIn">
                                Failed to send message. Please try again.
                            </p>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default ContactForm;