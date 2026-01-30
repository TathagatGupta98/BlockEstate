export default function Card({
  title,
  children,
  className = ""
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-merlot border border-taupe p-6 ${className}`}>
      <h3 className="mb-3">{title}</h3>
      {children}
    </div>
  );
}
