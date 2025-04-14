import type { Route } from "./+types/projects.$project";
import "../styles/project.scss";
import { FaDownload, FaGitAlt } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";
import { getLogoImage, getProjectImage } from "~/utils/projectImages";

export async function loader({ params }: Route.LoaderArgs) {
  const projectId = params.project;

  const projects = (await import("../content/projects/projects.json"))[
    "default"
  ];
  const project = projects.find((p) => p.slug === projectId);

  if (!project) {
    throw new Response("Not found", { status: 404 });
  }

  let logoImage: string | null = null;

  if (project.logo) {
    logoImage = getLogoImage(project.logo);
  }

  const projectImage = getProjectImage(project.image);

  return { project, logoImage, projectImage };
}

export function meta({ data: { project } }: Route.MetaArgs) {
  return [
    { title: `${project.name} — Tamim Arafat` },
    { name: "description", content: project.desc },
  ];
}

export default function Project({ loaderData }: Route.ComponentProps) {
  const {
    project: { name, desc, repo, productLink, downloadLink },
    logoImage,
    projectImage,
  } = loaderData;

  const tryButton =
    productLink != null ? (
      <a href={productLink} target="_blank" rel="noopener noreferrer">
        <FaExternalLinkAlt />
        Try it out
      </a>
    ) : downloadLink != null ? (
      <a href={downloadLink} target="_blank" rel="noopener noreferrer">
        <FaDownload />
        Download
      </a>
    ) : null;

  return (
    <div className="project__container">
      {logoImage && (
        <div className="project__logo animate__animated animate__flipInX animate__faster">
          <img src={logoImage} alt={name + " logo"} height="96" />
        </div>
      )}
      <div className="project__name animate__animated animate__fadeIn animate__faster">
        {name}
      </div>
      <div className="project__desc animate__animated animate__fadeIn animate__faster">
        {desc}
      </div>
      <div className="project__buttons animate__animated animate__fadeIn animate__faster">
        {tryButton}
        {repo?.url && (
          <a
            href={repo.url as string}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGitAlt /> View source
          </a>
        )}
      </div>
      <div className="project__images animate__animated animate__fadeInUpBig animate__fast">
        <img src={projectImage} alt={name + " screenshot"} />
      </div>
    </div>
  );
}
