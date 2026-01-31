interface InitialsAvatarProps {
  nickname: string;
  color?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-500 text-white",
  indigo: "bg-indigo-500 text-white",
  purple: "bg-purple-500 text-white",
  pink: "bg-pink-500 text-white",
  red: "bg-red-500 text-white",
  orange: "bg-orange-500 text-white",
  yellow: "bg-amber-400 text-amber-950",
  green: "bg-green-500 text-white",
  teal: "bg-teal-500 text-white",
  cyan: "bg-cyan-500 text-white",
};

const SIZE_MAP = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

function getInitials(nickname: string): string {
  if (!nickname.trim()) return "?";
  const words = nickname.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return nickname.slice(0, 2).toUpperCase();
}

export default function InitialsAvatar(props: InitialsAvatarProps) {
  const { nickname, color = "orange", size = "md", className = "" } = props;
  const colorClass = COLOR_MAP[color ?? "orange"] ?? COLOR_MAP.orange;
  const sizeClass = SIZE_MAP[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${colorClass} ${sizeClass} ${className}`}
      aria-label={`Avatar von ${nickname}`}
    >
      {getInitials(nickname)}
    </div>
  );
}
