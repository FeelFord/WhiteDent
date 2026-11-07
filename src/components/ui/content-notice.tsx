import { Info } from "lucide-react";
import type { ReactNode } from "react";

export function ContentNotice({ children }: { children: ReactNode }) {
  return <aside className="content-notice"><Info size={20} aria-hidden="true" /><p>{children}</p></aside>;
}
