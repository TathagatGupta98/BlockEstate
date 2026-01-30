import Navbar from "./Navbar";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="px-8 py-10">{children}</main>
    </div>
  );
}
