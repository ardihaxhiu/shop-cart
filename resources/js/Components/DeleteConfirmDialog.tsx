import { AlertTriangle, Trash } from 'lucide-react';
import { Button } from './Ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './Ui/Dialog';

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
}

export function DeleteConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title = 'Delete Item',
    description = 'This action cannot be undone and will permanently remove.',
    itemName,
}: DeleteConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
                        </div>
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        {itemName ? (
                            <>
                                Are you sure you want to delete{' '}
                                <span className="font-semibold text-foreground">
                                    {itemName}
                                </span>
                                ?
                                <br />
                                <br />
                                {description}
                            </>
                        ) : (
                            description
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

