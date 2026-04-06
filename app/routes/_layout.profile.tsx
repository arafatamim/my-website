import "../styles/profile.scss";
import {
  SiTypescript,
  SiReact,
  SiNodedotjs,
  SiPython,
  SiGo,
  SiRust,
  SiDocker,
  SiGit,
  SiMongodb,
  SiPostgresql,
  SiTailwindcss,
  SiFsharp,
  SiNextdotjs,
  SiFlutter,
  SiJetpackcompose,
} from "react-icons/si";

export function meta() {
  return [
    { title: "Profile — Tamim Arafat" },
    {
      name: "description",
      content: "Tamim Arafat, full-stack and mobile developer",
    },
  ];
}

export default function ProfileTab() {
  return (
    <div className="profile">
      <div className="profile__title-wrapper animate__animated animate__fadeInUp animate__faster">
        <h1 className="profile__title">
          Full-stack and mobile developer
        </h1>
        <svg
          className="profile__underline"
          viewBox="0 -25 400 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 5 C5 -12, 10 22, 15 5 C22 -18, 30 28, 38 5 C45 -10, 55 20, 65 5 C75 -22, 90 32, 105 5 C118 -15, 135 25, 150 5 C165 -20, 185 30, 205 5 C222 -12, 242 22, 260 5 C278 -18, 300 28, 320 5 C338 -10, 355 20, 375 5 C388 -15, 395 25, 400 5"
            fill="none"
            stroke="var(--accent-2)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <section className="profile__body animate__animated animate__fadeInUp animate__faster">
        <h2>Bio</h2>
        <p className="profile__body__bio prose">
          I started programming at 14 with QuickBASIC and never really stopped.
          Since then I've worked with JavaScript, Dart, Python, Go, and I'm
          currently learning Rust. For the past five years I've been building
          web and mobile apps — sometimes for work, mostly because I genuinely
          enjoy it. I also dabble in 3D, graphic design, and video editing.
          When I'm not at a screen, I'm usually tinkering with something or
          figuring out how things work.
        </p>

        {/* <aside className="profile__body__illustration animate__animated animate__fadeInRight animate__faster">
          <Illustration />
        </aside> */}
      </section>

      <section className="profile__skills animate__animated animate__fadeInUp animate__faster">
        <h2 className="profile__section__title">Skills</h2>
        <p className="prose">List of skills, tools and technologies I use:</p>
        <ul className="profile__skills__list">
          {[
            { icon: SiTypescript, name: "TypeScript" },
            { icon: SiReact, name: "React + Native" },
            { icon: SiNodedotjs, name: "Node.js" },
            { icon: SiNextdotjs, name: "Next.js" },
            { icon: SiPython, name: "Python" },
            { icon: SiGo, name: "Go" },
            { icon: SiRust, name: "Rust" },
            { icon: SiDocker, name: "Docker" },
            { icon: SiGit, name: "Git" },
            { icon: SiMongodb, name: "MongoDB" },
            { icon: SiPostgresql, name: "PostgreSQL" },
            { icon: SiTailwindcss, name: "Tailwind" },
            { icon: SiFlutter, name: "Flutter" },
            { icon: SiJetpackcompose, name: "Jetpack Compose" },
            { icon: SiFsharp, name: "F#" },
          ].map((skill, index) => (
            <li key={index} className="profile__skills__list__item">
              <skill.icon size={32} />
              <span>{skill.name}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
