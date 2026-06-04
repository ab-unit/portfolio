import { useRef, useEffect, useState } from "react";

const PROJECTS = [
  {
    id: "01",
    title: "Aether Platform",
    tag: "Analytics Dashboard",
    description:
      "A real-time dashboard made to display complicated dataset statistics quickly.",
    stack: ["React", "TypeScript", "Next.js"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "02",
    title: "Nova Commerce",
    tag: "Online Store",
    description:
      "A clean e-commerce shopping experience with smooth page transitions and Stripe payments.",
    stack: ["React", "Tailwind CSS", "Stripe"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "03",
    title: "Orbit Studio",
    tag: "Agency Website",
    description:
      "A portfolio site for a creative studio using subtle 3D interactions and animations.",
    stack: ["Three.js", "WebGL", "Vite"],
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
  },
];

const TOOLS_LEARNED = [
  "React",
  "Next.js",
  "vue.js",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Three.js",
  "WebGL",
  "Node.js",
  "Git / GitHub",
  "Figma",
  "Framer Motion",
  "Vite",
  "docker",
  "vercel",
  "strapi",
  "payload CMS",
  "stripe",
  "prisma",
  "mongodb",
  "postgresql",
  "redis",
  "graphql",
  "apollo",
  "aws",
  "python",
  "gcp",
];

interface ThreeJs {
  Scene: new () => { add: (obj: unknown) => void };
  PerspectiveCamera: new (
    fov: number,
    aspect: number,
    near: number,
    far: number,
  ) => {
    position: { z: number };
    aspect: number;
    updateProjectionMatrix: () => void;
  };
  WebGLRenderer: new (params: { alpha: boolean; antialias: boolean }) => {
    setSize: (w: number, h: number) => void;
    setPixelRatio: (r: number) => void;
    domElement: HTMLElement;
    render: (s: unknown, c: unknown) => void;
    dispose?: () => void;
  };
  BufferGeometry: new () => {
    setAttribute: (n: string, attr: unknown) => void;
  };
  BufferAttribute: new (arr: Float32Array, size: number) => unknown;
  PointsMaterial: new (p: {
    color: number;
    size: number;
    transparent: boolean;
    opacity: number;
  }) => unknown;
  Points: new (
    g: unknown,
    m: unknown,
  ) => { rotation: { y: number }; position: { x: number; y: number } };
}

type ThreeWindow = Window & { THREE?: ThreeJs };

export default function App() {
  const threeRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState("01");

  useEffect(() => {
    if (!threeRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    document.head.appendChild(script);

    let renderer: InstanceType<ThreeJs["WebGLRenderer"]> | null = null;
    let scene: InstanceType<ThreeJs["Scene"]> | null = null;
    let camera: InstanceType<ThreeJs["PerspectiveCamera"]> | null = null;
    let particles: InstanceType<ThreeJs["Points"]> | null = null;
    let frameId: number | null = null;

    script.onload = () => {
      if (!threeRef.current) return;
      const THREE = (window as ThreeWindow).THREE;
      if (!THREE) return;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        60,
        threeRef.current.clientWidth / threeRef.current.clientHeight,
        0.1,
        100,
      );
      camera.position.z = 6;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(
        threeRef.current.clientWidth,
        threeRef.current.clientHeight,
      );
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      threeRef.current.appendChild(renderer.domElement);

      const count = 50;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 8;
        positions[i + 2] = (Math.random() - 0.5) * 6;
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );

      const material = new THREE.PointsMaterial({
        color: 0x78716c,
        size: 0.05,
        transparent: true,
        opacity: 0.25,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      const animate = () => {
        if (!particles || !renderer || !scene || !camera) return;
        particles.rotation.y += 0.0002;
        particles.position.x +=
          (mouse.current.x * 0.2 - particles.position.x) * 0.04;
        particles.position.y +=
          (mouse.current.y * 0.2 - particles.position.y) * 0.04;

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();
    };

    const handleResize = () => {
      if (!threeRef.current || !camera || !renderer) return;
      camera.aspect =
        threeRef.current.clientWidth / threeRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        threeRef.current.clientWidth,
        threeRef.current.clientHeight,
      );
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (frameId !== null) cancelAnimationFrame(frameId);
      if (renderer && renderer.domElement) {
        renderer.dispose?.();
        renderer.domElement.remove();
      }
      script.remove();
    };
  }, []);

  return (
    <div className="bg-stone-50/40 text-stone-900 min-h-screen antialiased selection:bg-stone-200">
      {/* HEADERBAR */}
      <header className="fixed top-0 left-0 w-full h-16 lg:h-20 px-6 lg:px-16 flex justify-between items-center z-50 backdrop-blur-md bg-stone-50/60 lg:bg-transparent border-b border-stone-200 lg:border-none">
        <span className="text-sm font-semibold tracking-tight">
          Ahmed Bahobeshi
        </span>
        <a
          href="mailto:ahmed.bahobeshi@hotmail.com"
          className="text-xs font-medium uppercase tracking-wider text-stone-500 hover:text-stone-900 transition-colors"
        >
          Email Me
        </a>
      </header>

      {/* SPLIT LAYOUT WINDOW */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* LEFT COMPONENT COLUMN (FIXED DESKTOP VIEW WITH HIDDEN SCROLLBAR) */}
        <div className="w-full lg:w-[45%] lg:fixed lg:h-screen left-0 top-0 flex flex-col justify-center p-6 pt-24 pb-12 lg:p-16 lg:pt-20 border-b lg:border-b-0 lg:border-r border-stone-200 bg-stone-100/30 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div
            ref={threeRef}
            className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply"
          />

          <div className="relative z-10 max-w-md space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-stone-900 leading-[1.2]">
                I build clean, interactive websites that look good and run
                smoothly.
              </h1>
              <p className="mt-3 text-stone-400 text-xs uppercase tracking-wider font-medium">
                Based in Stockholm, Sweden
              </p>
            </div>

            {/* ABOUT ME COMPONENT CONTAINER */}
            <div className="border-t border-stone-200/80 pt-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                About Me
              </span>
              <p className="text-stone-600 text-sm leading-relaxed font-normal">
                I like writing clean code and designing websites that load
                quickly and work well on any device. I avoid unnecessary
                features and focus on making things straightforward for the
                person using it.
              </p>
            </div>

            {/* INTEGRATED CLEAN TOOLS COMPONENT REGION */}
            <div className="border-t border-stone-200/80 pt-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Tools I've Learned
              </span>
              <div className="flex flex-wrap gap-1.5">
                {TOOLS_LEARNED.map((tool) => (
                  <span
                    key={tool}
                    className="text-[11px] font-mono bg-stone-200/40 text-stone-600 px-2.5 py-0.5 rounded transition-colors hover:bg-stone-200/70"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SCROLL PANEL: COMPACT CHASSIS CHANNELS */}
        <div className="w-full lg:w-[55%] lg:ml-[45%] p-6 py-12 lg:p-16 lg:pt-36 space-y-12">
          <div className="flex justify-between items-center border-b border-stone-200 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Selected Projects
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600/70" />
              Available for work
            </span>
          </div>

          {/* PORTFOLIO ACCORDIONS GRID */}
          <div className="space-y-6">
            {PROJECTS.map((project) => {
              const isHovered = hoveredId === project.id;
              return (
                <div
                  key={project.id}
                  onMouseEnter={() => setHoveredId(project.id)}
                  className={`group block p-5 sm:p-6 rounded-xl border transition-all duration-200 bg-white ${
                    isHovered
                      ? "border-stone-300 shadow-sm"
                      : "border-stone-200/60 lg:opacity-60"
                  }`}
                >
                  {/* Title Headers */}
                  <div className="flex justify-between items-baseline gap-4 mb-3">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-xs text-stone-400">
                        {project.id}
                      </span>
                      <h3 className="text-xl font-normal text-stone-900">
                        {project.title}
                      </h3>
                    </div>
                    <span className="text-xs text-stone-400 italic">
                      {project.tag}
                    </span>
                  </div>

                  {/* MINI PROFILE PREVIEW PICTURE FRAME */}
                  <div className="overflow-hidden rounded bg-stone-100 aspect-[21/9] h-32 sm:h-40 w-full mb-4 border border-stone-200/40 relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-500"
                      loading="lazy"
                    />
                  </div>

                  <p className="text-sm text-stone-500 leading-relaxed max-w-xl mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap justify-between items-center gap-4 border-t border-stone-100 pt-3">
                    <div className="flex flex-wrap gap-1">
                      {project.stack.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] px-2 py-0.5 rounded border border-stone-100 bg-stone-50/50 text-stone-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <span
                      className={`text-xs font-medium text-stone-900 inline-flex items-center gap-1 transition-all ${
                        isHovered
                          ? "opacity-100 translate-x-0"
                          : "lg:opacity-0 lg:-translate-x-2"
                      }`}
                    >
                      View project →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-stone-200 bg-stone-100/50 py-8 px-6 lg:px-16 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-400">
          <div className="flex flex-wrap justify-center gap-1 items-center">
            <span>© {new Date().getFullYear()} Ahmed Bahobeshi.</span>
            <span className="hidden sm:inline text-stone-200">/</span>
            <span>Stockholm, SE</span>
          </div>
          <div className="flex gap-6">
            <a
              href="https://github.com/ab-unit"
              className="hover:text-stone-900 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/ahmed-bahobeshi/"
              className="hover:text-stone-900 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:ahmed.bahobeshi@hotmail.com"
              className="hover:text-stone-900 transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
