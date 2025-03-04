"use client";

import { useApiShowWatchProgressArchiveShowCreate } from "@/api/api/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QUERYKEYS } from "@/queries/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface ArchiveShowModalProps {
  tmdbId: number;
  open: boolean;
  onClose: () => void;
}

export const ArchiveShowModal = ({
  tmdbId,
  open,
  onClose,
}: ArchiveShowModalProps) => {
  const queryClient = useQueryClient();
  const { mutate: archiveShow } = useApiShowWatchProgressArchiveShowCreate({
    mutation: {
      onSuccess: () => {
        toast.success("Show archived");
        queryClient.invalidateQueries({
          queryKey: [QUERYKEYS.continueWatchingList],
        });
      },
    },
  });

  const handleArchive = (e: React.MouseEvent<HTMLButtonElement>) => {
    archiveShow({
      data: {
        tmdb_id: tmdbId,
      },
    });
    onClose();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive show</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to archive this show? Your watch progress will
            be saved but you won&apos;t see it on your continue watching list
            anymore.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleArchive}>Archive</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
