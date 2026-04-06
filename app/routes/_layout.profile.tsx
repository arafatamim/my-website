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
      <h1 className="animate__animated animate__fadeInUp animate__faster">
        Full-stack and mobile developer
      </h1>
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
