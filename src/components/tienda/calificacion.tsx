import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Calificacion({
  valor,
  tamano = "h-4 w-4",
  className
}: {
  valor: number;
  tamano?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            tamano,
            n <= Math.round(valor) ? "fill-amber-400 text-amber-400" : "text-gray-300"
          )}
        />
      ))}
    </div>
  );
}
