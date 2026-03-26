import AboutUsAnimation from "@/components/AboutUsAnimation";
import { getMyRequests, getMySentRequests } from "../actions";
import { getUserId } from "@/lib/clerk-server"; // FIXED: Safe helper
import NavBar from "@/components/NavBar";
import Link from "next/link";

export default async function AboutUsPage() {
  const userId = await getUserId(); // FIXED: Using helper
  const myRequests = userId ? (await getMyRequests()) || [] : [];
  const mySentRequests = userId ? (await getMySentRequests()) || [] : [];

  return (
    <main className="min-h-screen bg-kindred-bg p-4 md:p-8 text-kindred-text relative overflow-hidden isolate transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-96 bg-kindred-lime/10 blur-[120px] pointer-events-none -z-10"></div>

      <NavBar
        userId={userId}
        inboxCount={myRequests.length}
        outboxCount={mySentRequests.length}
      />

      <section className="max-w-6xl mx-auto relative z-10">
        <Link
          href="/"
          className="text-kindred-lime text-xs font-black uppercase tracking-[0.3em] hover:opacity-70 transition-all flex items-center gap-2 mb-2"
        >
          ← Back to your Profile
        </Link>

        {/* Animation container sits higher now */}
        <div className="-mt-4">
          <AboutUsAnimation />
        </div>

        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-kindred-text mb-4">
            Our Mission
          </h2>
          <div className="space-y-6 text-kindred-text/80 text-lg leading-relaxed text-left">
            <p className="font-medium text-kindred-text text-center text-xl">
              Kindred is a community built on connection, support, and shared
              growth. We believe people thrive when they come together.
            </p>
            <p>
              The best way to understand Kindred is to experience it. Join us
              and discover the power of kindness in action. Together, we can
              create a world where everyone belongs.
            </p>
            <p>
              We are a team of passionate individuals dedicated to fostering a
              culture of kindness and mutual support. Our backgrounds are
              diverse, but we share a common vision: to create a world where
              everyone feels connected and valued. We believe that by empowering
              individuals to help each other, we can build stronger communities
              and a more compassionate society. Join us on this journey to make
              kindness the norm, not the exception.
            </p>
            <p>
              At Kindred, we are committed to creating a safe and inclusive
              space for everyone. We believe that kindness has the power to
              break down barriers and bring people together. Whether you are
              looking to offer support, seek help, or simply connect with
              others, Kindred is here for you. Join us in building a community
              where everyone can thrive and feel a sense of belonging. Together,
              we can make a difference, one act of kindness at a time.
            </p>
            <p>
              We are more than just a platform; we are a movement towards a
              kinder world. Our mission is to empower individuals to make a
              positive impact in their communities through simple acts of
              kindness. We believe that when people come together to support
              each other, we can create a ripple effect of compassion that
              extends far beyond our immediate circles. Join us in spreading
              kindness and building a world where everyone feels seen, heard,
              and valued. Together, we can create a brighter future for all.
            </p>
            <p>
              Kindred is a community built on the belief that kindness can
              change the world. We are dedicated to fostering connections,
              supporting one another, and creating a space where everyone feels
              valued and empowered. Our mission is to inspire and facilitate
              acts of kindness that ripple through communities, creating a more
              compassionate and inclusive society. Join us in our journey to
              make kindness the foundation of our interactions and the driving
              force behind positive change. Together, we can build a world where
              everyone belongs and thrives.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
