'use client';

export default function Copyright() {
    return (
        <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Little Tokyo Sushi. All rights reserved.
        </p>
    );
}
