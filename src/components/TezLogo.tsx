import { cn } from "@/lib/utils";

interface TezLogoProps {
  collapsed?: boolean;
  className?: string;
}

export function TezLogo({ collapsed, className }: TezLogoProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
        <span className="text-primary-foreground font-black text-sm">T</span>
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-secondary animate-pulse-dot" />
      </div>
      {!collapsed && (
        <span className="text-lg font-bold tracking-tight">
          <span className="text-primary">Tez</span>
          <span className="text-foreground">Health</span>
        </span>
      )}
    </div>
  );
}
