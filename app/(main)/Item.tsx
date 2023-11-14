import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  active?: boolean;
  documentIcon?: string;
  expanded?: boolean;
  icon: LucideIcon;
  id?: Id<"documents">;
  isSearch?: boolean;
  label: string;
  level?: number;
  onClick: () => void;
  onExpand?: () => void;
}

const Item = ({
  active,
  documentIcon,
  expanded,
  icon: Icon,
  id,
  isSearch,
  label,
  level,
  onClick,
  onExpand,
}: Props) => {
  const { user } = useUser();
  const router = useRouter();
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);

  const handleArchive = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    if (!id) return;

    const promise = archive({ id });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Error while archiving note.",
    });
  };

  const handleCreateNestedDoc = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    const promise = create({ title: "Untitled", parentDocument: id }).then(
      (documentId) => {
        if (!expanded) {
          onExpand?.();
        }

        router.push(`/documents/${documentId}`);
      },
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation;
    onExpand?.();
  };

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group flex min-h-[28px] w-full items-center py-2 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5",
        active && "bg-primary/5 text-primary",
      )}
    >
      {/* Show right arrow if the arrow is not expanded */}
      {/* If expanded show the down icon */}
      {!!id && (
        <div
          role="button"
          className="mr-1 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}

      {/* Document Icon */}
      {documentIcon ? (
        <div className="mr-2 shrink-0 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="shirnk-0 mr-2 h-[18px] w-[18px] text-muted-foreground" />
      )}

      {/* Label/Title of the document */}
      <span className="truncate">{label}</span>

      {/* if it is the search icon show keyboard shortcuts for it */}
      {isSearch && (
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}

      {/* Plus icon for adding a new page inside the current page */}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div role="button" className="action-btn">
                <MoreHorizontal className="action-btn__icon" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={handleArchive}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <div className="p-2 text-xs text-muted-foreground">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={handleCreateNestedDoc}
            className="action-btn"
          >
            <Plus className="action-btn__icon" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};

export default Item;
