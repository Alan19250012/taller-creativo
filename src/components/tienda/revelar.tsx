"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Envuelve contenido y lo revela con un desvanecimiento + deslizamiento
// cuando entra en el viewport (animación sutil de scroll).
export function Revelar({
  children,
  className,
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
