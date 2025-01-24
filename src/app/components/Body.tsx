import { Footer } from "@components";

interface BodyProps {
  children: React.ReactNode;
  className?: string;
}

export const Body = (props: BodyProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center  dark:text-white px-4 py-2 min-h-screen ${
        props.className ?? "bg-slate-50 dark:bg-slate-800 text-slate-950"
      }`}
    >
      <div className="max-w-screen-2xl mb-auto">{props.children}</div>
      <Footer />
    </div>
  );
};
