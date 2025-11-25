import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useToastFlash() {
    const { props } = usePage();
    const previousFlash = useRef<any>(null);

    useEffect(() => {
        const flash = (props as any).flash;
        const errors = (props as any).errors;

        // Only show flash messages if they've changed
        if (flash && JSON.stringify(flash) !== JSON.stringify(previousFlash.current)) {
            previousFlash.current = flash;

            // Handle success messages
            if (flash.success) {
                toast.success(flash.success);
            }

            // Handle error messages
            if (flash.error) {
                toast.error(flash.error);
            }

            // Handle info messages
            if (flash.info) {
                toast.info(flash.info);
            }

            // Handle warning messages
            if (flash.warning) {
                toast.warning(flash.warning);
            }
        }

        // Handle validation errors
        if (errors && Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            if (typeof firstError === 'string') {
                toast.error(firstError);
            }
        }
    }, [props]);
}

