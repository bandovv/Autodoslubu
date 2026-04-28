import { useCallback, useState, type MouseEvent } from "react";
import { Copy, Check } from "lucide-react";
import { CONTACT_EMAIL } from "../contactInfo";

type Props = {
  className?: string;
};

export default function CopyEmailButton({ className }: Props) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = CONTACT_EMAIL;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-[#AD1457] shadow-sm hover:bg-[#FCE4EC] transition-colors ${className ?? ""}`}
      aria-label={copied ? "Adres skopiowany do schowka" : "Skopiuj adres e-mail do schowka"}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
          <span>Skopiowano!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 shrink-0" aria-hidden />
          <span>Kopiuj</span>
        </>
      )}
    </button>
  );
}
