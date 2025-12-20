import Image from "next/image";
import { Mail } from "lucide-react";


function Accent({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-amber-700 underline decoration-amber-300 underline-offset-4">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <div className="bg-smileys min-h-screen">

      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-8 py-16 md:grid-cols-2">
        {/* Left */}
        <section>
          <h1 className="text-5xl font-semibold tracking-tight text-zinc-900 md:text-6xl">
            Hey, I&apos;m Ritvik!
          </h1>

          <p className="mt-7 text-lg leading-8 text-zinc-700">
            I&apos;m a Bioengineering student at Penn with potential minors in{" "}
            <Accent>Engineering Entrepreneurship</Accent>, <Accent>Math</Accent>,
            and <Accent>South Asian Studies</Accent>.
            <br />
            <br />
            I hope to build impactful and equitable medical device technologies.
            My projects lie at the intersection of
            <Accent> engineering</Accent>, <Accent>software</Accent>,{" "}
            <Accent>research</Accent>.
          </p>

          <p className="mt-5 text-lg leading-8 text-zinc-700">
            I like projects that have{" "}
            <span className="font-medium">application in my everyday life</span>,
            use a little <span className="font-medium">creativity</span>, and
            teach <span className="font-medium">me new skills</span>.
          </p>

          <div className="mt-9 flex items-center gap-2 text-sm text-zinc-600">
  <Mail className="h-4 w-4 text-amber-800" />
  <span>Let&apos;s connect:</span>
  <a
    href="mailto:rellen26@seas.upenn.edu"
    className="font-medium text-amber-800 hover:text-amber-900 hover:underline"
  >
    rellen26@seas.upenn.edu
  </a>
</div>

        </section>

        {/* Right */}
        <section className="flex justify-center md:justify-end">
          <div
            data-cursor
            className="group relative w-full max-w-sm rounded-3xl border border-zinc-200/70 bg-white/70 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* warm glow (appears on hover) */}
            <div className="pointer-events-none absolute -inset-2 rounded-[28px] bg-amber-200/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/ritvik.jpg"
                alt="Ritvik Ellendula"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                priority
              />
            </div>

            <div className="px-1 pt-4">
              <p className="text-sm font-semibold tracking-tight text-zinc-900">
                Ritvik Ellendula
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                Building stuff I find cool.
              </p>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}