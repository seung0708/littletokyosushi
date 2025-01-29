'use client';
import { useForm } from "react-hook-form";
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import { Textarea } from "../ui/textarea";

const contactFormSchema = z.object({
    email: z.string().email('Invalid email format'),
    subject: z.string(),
    message: z.string()
})

const ContactForm: React.FC = () => {
    const form = useForm<z.infer<typeof contactFormSchema>>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            email: '',
            subject: '',
            message: ''
        }
    });

    async function onSubmit(values: z.infer<typeof contactFormSchema>) {
        const { email, subject, message } = values;

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, subject, message }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Email sent successfully');
                form.reset();
            } else {
                console.error('Failed to send email:', data.error);
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
    return (
        <Form {...form}>
        <form action="#" className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="block mb-2 text-sm font-medium">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input 
                                    type="email"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" 
                                    placeholder="name@email.com"
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="block mb-2 text-sm font-medium">
                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                                <Input 
                                    {...field} 
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="block mb-2 text-sm font-medium">
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea 
                                    {...field} 
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" 
                                    placeholder="Leave a comment..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <Button 
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600"
            >
                Send
            </Button>
        </form>
    </Form>
    )
}

export default ContactForm;