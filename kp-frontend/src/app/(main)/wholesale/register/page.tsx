import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Coming Soon",
    robots: "noindex, nofollow"
}

export default function ComingSoonPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background">
      <div
        className="text-center p-8 opacity-0"
        style={{
          animation: "fadeUp 0.8s ease-out forwards",
        }}
      >
        <h1 className="text-5xl font-bold mb-4">
          Coming Soon
        </h1>
      </div>
      <style>
        {`
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
