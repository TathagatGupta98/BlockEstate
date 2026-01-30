type DividerProps = {
  label?: string;
};

export default function Divider({ label }: DividerProps) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 border-t border-taupe" />

      {label && (
        <span className="text-xs tracking-wide text-gold uppercase">
          {label}
        </span>
      )}

      <div className="flex-1 border-t border-taupe" />
    </div>
  );
}
