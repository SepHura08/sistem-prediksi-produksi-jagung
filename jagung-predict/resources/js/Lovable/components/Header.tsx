import { Bell, Settings } from "lucide-react";

interface PropsHeader {
  judul: string;
  namaPengguna?: string;
  peranPengguna?: string;
}

export function Header({ judul, namaPengguna = "Administrator", peranPengguna = "Super Admin" }: PropsHeader) {
  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-8 py-3 sm:py-4 gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <h2 className="text-base sm:text-2xl font-bold tracking-tight text-primary truncate">{judul}</h2>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-4">
          <button className="p-2 rounded-full hover:bg-muted transition-colors relative">
            <Bell className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" />
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition-colors hidden sm:block">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold leading-tight">{namaPengguna}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{peranPengguna}</p>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold text-sm">
            {namaPengguna.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}

