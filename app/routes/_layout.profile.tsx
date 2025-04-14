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
} from "react-icons/si";

export function meta() {
  return [
    { title: "Profile — Tamim Arafat" },
    {
      name: "description",
      content: "Tamim Arafat, full-stack developer from Bangladesh",
    },
  ];
}

export default function ProfileTab() {
  return (
    <div className="profile">
      <h1 className="animate__animated animate__fadeInUp animate__faster">
        Full-stack developer from Bangladesh
      </h1>
      <section className="profile__body animate__animated animate__fadeInUp animate__faster">
        <h2>Bio</h2>
        <p className="profile__body__bio prose">
          I discovered my passion for programming at 14, starting with
          QuickBASIC. Over the years, I’ve worked with JavaScript, Dart, Python,
          Go, and now I’m learning Rust. For the past five years, I’ve been
          focused on web development, building sites for fun and profit while
          sharpening my skills. I also work on mobile apps, 3D and graphic
          design, and video editing. Outside of tech, I’m studying
          biotechnology, blending science with creativity.
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
            { icon: SiReact, name: "React" },
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
