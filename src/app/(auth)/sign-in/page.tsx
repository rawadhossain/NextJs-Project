'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/use-toast';

function page() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debouncedUsername = useDebounceValue(username, 300);

    const router = useRouter();
    const { toast } = useToast();

    return <div>page</div>;
}

export default page;
