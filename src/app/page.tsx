// src/app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
<div className="bg-custom-orange text-custom-white p-6">
  This div has a custom red background and custom white text.
</div>

<button className="bg-custom-cyan hover:bg-custom-white text-white py-2 px-4 rounded">
  Click Me
</button>

    </main>
  );
}
