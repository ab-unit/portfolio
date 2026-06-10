import { useRef, useEffect, useState } from "react";

const CONTACT_EMAIL = "ahmed.bahobeshi@hotmail.com";

const TOOL_TAG_CLASSES = [
  "hover:bg-emerald-100 hover:text-emerald-700",
  "hover:bg-sky-100 hover:text-sky-700",
  "hover:bg-violet-100 hover:text-violet-700",
  "hover:bg-amber-100 hover:text-amber-700",
  "hover:bg-rose-100 hover:text-rose-700",
  "hover:bg-lime-100 hover:text-lime-700",
];

const STACK_TAG_CLASSES = [
  "hover:border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700",
  "hover:border-sky-200 hover:bg-sky-100 hover:text-sky-700",
  "hover:border-violet-200 hover:bg-violet-100 hover:text-violet-700",
  "hover:border-amber-200 hover:bg-amber-100 hover:text-amber-700",
  "hover:border-rose-200 hover:bg-rose-100 hover:text-rose-700",
  "hover:border-lime-200 hover:bg-lime-100 hover:text-lime-700",
];

const PROJECT_LINK_CLASSES = [
  "text-sky-600 hover:text-sky-900",
  "text-violet-600 hover:text-violet-900",
  "text-rose-600 hover:text-rose-900",
];

const PROJECTS = [
  {
    id: "01",
    title: "Aerial Analytics",
    tag: "Dashboard UI",
    description:
      "Interactive reporting screens designed for quick decisions, clear visuals, and minimal interaction noise.",
    stack: ["React", "TypeScript", "Tailwind CSS"],
    demo: "https://github.com/ab-unit",
    code: "https://github.com/ab-unit",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "02",
    title: "Nova Commerce",
    tag: "E-commerce Experience",
    description:
      "A polished shopping experience with smooth interactions, fast filters, and checkout clarity.",
    stack: ["React", "Tailwind CSS", "Stripe"],
    demo: "https://github.com/ab-unit",
    code: "https://github.com/ab-unit",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "03",
    title: "Orbit Studio",
    tag: "Brand Website",
    description:
      "A refined portfolio and landing experience for creative teams, with subtle motion and attention to detail.",
    stack: ["Three.js", "WebGL", "Vite"],
    demo: "https://github.com/ab-unit",
    code: "https://github.com/ab-unit",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
  },
];

const TOOLS_LEARNED = [
  "React",
  "Next.js",
  "Vue.js",
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
  "Docker",
  "Vercel",
  "Strapi",
  "Payload CMS",
  "Stripe",
  "Prisma",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "GraphQL",
  "Apollo",
  "AWS",
  "Python",
  "GCP",
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
    setClearColor: (color: number, alpha: number) => void;
    domElement: HTMLElement;
    render: (s: unknown, c: unknown) => void;
    dispose?: () => void;
  };
  BufferGeometry: new () => {
    setAttribute: (n: string, attr: unknown) => void;
  };
  BufferAttribute: new (arr: Float32Array, size: number) => unknown;
  PointsMaterial: new (p: {
    color?: number;
    size: number;
    transparent: boolean;
    opacity: number;
    sizeAttenuation?: boolean;
    vertexColors?: boolean;
  }) => unknown;
  Points: new (
    g: unknown,
    m: unknown,
  ) => { rotation: { x: number; y: number; z: number }; position: { x: number; y: number } };
  Color: new () => {
    r: number;
    g: number;
    b: number;
    setHSL: (h: number, s: number, l: number) => void;
  };
  SphereGeometry: new (
    radius: number,
    widthSegments: number,
    heightSegments: number,
  ) => unknown;
  WireframeGeometry: new (geometry: unknown) => unknown;
  LineBasicMaterial: new (p: {
    color: number;
    transparent: boolean;
    opacity: number;
  }) => unknown;
  LineSegments: new (g: unknown, m: unknown) => { rotation: { x: number; y: number } };
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
      renderer.setClearColor(0xd8e4ff, 0.12);
      threeRef.current.appendChild(renderer.domElement);

      const count = 45;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 8;
        positions[i + 1] = (Math.random() - 0.5) * 5;
        positions[i + 2] = (Math.random() - 0.5) * 4;

        const hue = 0.56 + Math.random() * 0.08;
        const saturation = 0.6 + Math.random() * 0.2;
        const lightness = 0.6 + Math.random() * 0.15;
        const color = new THREE.Color();
        color.setHSL(hue, saturation, lightness);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.12,
        transparent: true,
        opacity: 0.35,
        vertexColors: true,
        sizeAttenuation: true,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      const animate = () => {
        if (!particles || !renderer || !scene || !camera) return;
        particles.rotation.y += 0.0006;

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
          className="text-xs font-medium uppercase tracking-wider text-stone-500 transition duration-200 ease-out hover:text-cyan-700"
        >
          Email Me
        </a>
      </header>

      {/* SPLIT LAYOUT WINDOW */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* LEFT COMPONENT COLUMN (FIXED DESKTOP VIEW WITH HIDDEN SCROLLBAR) */}
        <div className="relative w-full lg:w-[45%] xl:w-[42%] lg:fixed lg:h-screen left-0 top-0 flex flex-col justify-center p-6 pt-24 pb-12 lg:p-16 lg:pt-20 border-b lg:border-b-0 lg:border-r border-stone-200 bg-stone-100/30 overflow-y-auto min-h-[55vh] lg:min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div
            ref={threeRef}
            className="absolute inset-0 z-0 pointer-events-none"
          />

          <div className="relative z-10 max-w-md space-y-8">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-400 font-semibold">
                Frontend Developer & Interface Designer
              </p>
              <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-stone-900 leading-[1.1]">
                I craft polished interfaces that feel fast, clear and effortless.
              </h1>
              <p className="text-stone-600 text-base leading-relaxed max-w-xl">
                Building web experiences for SaaS, product brands, and digital teams — with a focus on performance, accessibility, and clean interaction design.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center justify-center rounded-full bg-cyan-900 px-5 py-3 text-sm font-semibold text-white transition duration-200 ease-out hover:bg-cyan-800 hover:text-cyan-100"
                >
                  Email Me
                </a>
                <a
                  href="https://github.com/ab-unit"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-fuchsia-300 bg-white px-5 py-3 text-sm font-semibold text-fuchsia-900 transition duration-200 ease-out hover:bg-fuchsia-50 hover:text-fuchsia-900"
                >
                  View GitHub
                </a>
              </div>
              <p className="mt-2 text-stone-400 text-xs uppercase tracking-wider font-medium">
                Based in Stockholm, Sweden · Available for new projects
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
                {TOOLS_LEARNED.map((tool, toolIndex) => {
                  const hoverClass = TOOL_TAG_CLASSES[toolIndex % TOOL_TAG_CLASSES.length];
                  return (
                    <span
                      key={tool}
                      className={`text-[11px] font-mono bg-stone-200/40 text-stone-600 px-2.5 py-0.5 rounded transition duration-200 ease-out ${hoverClass}`}
                    >
                      {tool}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SCROLL PANEL: COMPACT CHASSIS CHANNELS */}
        <div className="w-full lg:w-[55%] xl:w-[58%] lg:ml-[45%] xl:ml-[42%] p-6 py-12 lg:p-16 lg:pt-36 space-y-12">
          <div className="flex justify-between items-center border-b border-stone-200 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Selected Projects
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600/70" />
              Available for work
            </span>
          </div>

          {PROJECTS.map((project, projectIndex) => {
            const isHovered = hoveredId === project.id;
            return (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredId(project.id)}
                className={`group block p-5 sm:p-6 rounded-xl border transition-all duration-200 bg-white ${
                  isHovered
                    ? "border-stone-300 shadow-sm opacity-100"
                    : "border-stone-200/60 opacity-100 lg:opacity-60"
                }`}
              >
                <div className="flex justify-between items-baseline gap-4 mb-3">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-xs text-stone-400">{project.id}</span>
                    <h3 className="text-xl font-normal text-stone-900">{project.title}</h3>
                  </div>
                  <span className="text-xs text-stone-400 italic">{project.tag}</span>
                </div>

                <div className="overflow-hidden rounded bg-stone-100 aspect-[21/9] h-32 sm:h-40 w-full mb-4 border border-stone-200/40 relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale-0 lg:grayscale lg:opacity-90 lg:group-hover:grayscale-0 lg:group-hover:opacity-100 transition-all duration-500"
                    loading="lazy"
                  />
                </div>

                <p className="text-sm text-stone-500 leading-relaxed max-w-xl mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap justify-between items-center gap-3 border-t border-stone-100 pt-4">
                  <div className="flex flex-wrap gap-1">
                    {project.stack.map((s, stackIndex) => {
                      const stackClass = STACK_TAG_CLASSES[stackIndex % STACK_TAG_CLASSES.length];
                      return (
                        <span
                          key={s}
                          className={`text-[11px] px-2 py-0.5 rounded border border-stone-100 bg-stone-50/50 text-stone-600 transition duration-200 ease-out ${stackClass}`}
                        >
                          {s}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-stone-700">
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className={`${PROJECT_LINK_CLASSES[projectIndex % PROJECT_LINK_CLASSES.length]} transition duration-200 ease-out`}
                      >
                        Live demo
                      </a>
                    )}
                    {project.code && (
                      <a
                        href={project.code}
                        target="_blank"
                        rel="noreferrer"
                        className={`${PROJECT_LINK_CLASSES[(projectIndex + 1) % PROJECT_LINK_CLASSES.length]} transition duration-200 ease-out`}
                      >
                        View code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <section
            id="contact"
            className="rounded-3xl border border-stone-200 bg-white/90 p-8 shadow-sm max-w-3xl"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-400 font-semibold">
                  Let's build something together
                </p>
                <h2 className="mt-3 text-2xl font-medium text-stone-900">
                  Ready to bring your web project to life?
                </h2>
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center justify-center rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-white transition duration-200 ease-out hover:bg-indigo-800 hover:text-indigo-100"
              >
                Say hello
              </a>
            </div>
          </section>
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
              className="transition duration-200 ease-out text-cyan-600 hover:text-cyan-900"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/ahmed-bahobeshi/"
              className="transition duration-200 ease-out text-violet-600 hover:text-violet-900"
            >
              LinkedIn
            </a>
            <a
              href="mailto:ahmed.bahobeshi@hotmail.com"
              className="transition duration-200 ease-out text-amber-600 hover:text-amber-900"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
