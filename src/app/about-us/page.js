// import AboutUsAnimation from "./AboutUsAnimation";
import AboutUsAnimation from "@/components/AboutUsAnimation";
// import BackButton from "@/components/BackButton";
// import Link from "next/link";

// This page tells people what Kindred is all about
export default function AboutUsPage() {
  return (
    <div
      className="min-h-screen bg-[#FAFAD6]"
      style={{ backgroundColor: "#FAFAD6" }}
    >
      {/* <BackButton href="/" label="← Back to your Profile" /> */}
      {/* <Link
        href="/"
        className="text-lime-400 text-xs font-black uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2 mb-8"
      >
        ← Back to your Profile
      </Link> */}

      {/* This shows the moving picture at the top of the page */}
      <AboutUsAnimation />

      {/* This box holds all the writing about our mission */}
      <div
        className="max-w-2xl mx-auto px-6 py-16 text-center"
        // style={{ backgroundColor: "#FAFAD6" }}
      >
        <h2 className="text-3xl font-bold text-green-900 mb-4">Our Mission</h2>

        {/* These paragraphs explain that we want everyone to help each other and be kind */}
        <p className="text-green-800 text-lg leading-relaxed">
          Kindred is a community built on connection, support, and shared
          growth. We believe people thrive when they come together.
        </p>
        <p>
          The best way to understand Kindred is to experience it. Join us and
          discover the power of kindness in action. Together, we can create a
          world where everyone belongs.
        </p>
        <p>
          We are a team of passionate individuals dedicated to fostering a
          culture of kindness and mutual support. Our backgrounds are diverse,
          but we share a common vision: to create a world where everyone feels
          connected and valued. We believe that by empowering individuals to
          help each other, we can build stronger communities and a more
          compassionate society. Join us on this journey to make kindness the
          norm, not the exception.
        </p>
        <p>
          At Kindred, we are committed to creating a safe and inclusive space
          for everyone. We believe that kindness has the power to break down
          barriers and bring people together. Whether you are looking to offer
          support, seek help, or simply connect with others, Kindred is here for
          you. Join us in building a community where everyone can thrive and
          feel a sense of belonging. Together, we can make a difference, one act
          of kindness at a time.
        </p>
        <p>
          We are more than just a platform; we are a movement towards a kinder
          world. Our mission is to empower individuals to make a positive impact
          in their communities through simple acts of kindness. We believe that
          when people come together to support each other, we can create a
          ripple effect of compassion that extends far beyond our immediate
          circles. Join us in spreading kindness and building a world where
          everyone feels seen, heard, and valued. Together, we can create a
          brighter future for all.
        </p>
        <p>
          Kindred is a community built on the belief that kindness can change
          the world. We are dedicated to fostering connections, supporting one
          another, and creating a space where everyone feels valued and
          empowered. Our mission is to inspire and facilitate acts of kindness
          that ripple through communities, creating a more compassionate and
          inclusive society. Join us in our journey to make kindness the
          foundation of our interactions and the driving force behind positive
          change. Together, we can build a world where everyone belongs and
          thrives.
        </p>
      </div>
    </div>
  );
}
