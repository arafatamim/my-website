import { NavLink, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import type { ProjectWithMedia } from "~/utils/projectImages";
import "./ProjectItem.scss";

interface ProjectItemProps {
  project: ProjectWithMedia;
  index?: number;
  shape?: "feature" | "tall" | "wide" | "square";
  /** filtered out — dropped from the grid flow, animated by GSAP Flip */
  hidden?: boolean;
}

// crossfade duration; keep in sync with the opacity transition in ProjectItem.scss
const VIDEO_FADE_MS = 320;

const ProjectItem: React.FC<ProjectItemProps> = (
  { project, index, shape = "square", hidden = false, ...rest },
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isHovering, setIsHovering] = useState(false);
  const [videoMounted, setVideoMounted] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const hasVideo = project.projectVideo != null;

  // mount on hover-in, fade to opaque next frame; on hover-out, fade to
  // transparent and unmount once the CSS transition has had time to finish —
  // a quick re-hover during fade-out cancels the pending unmount instead of
  // flashing back to frame 0.
  useEffect(() => {
    if (!videoMounted) return;
    if (isHovering) {
      const frame = requestAnimationFrame(() => setVideoVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    setVideoVisible(false);
    const timer = setTimeout(() => setVideoMounted(false), VIDEO_FADE_MS);
    return () => clearTimeout(timer);
  }, [videoMounted, isHovering]);

  const handleMouseEnter = () => {
    if (!hasVideo) return;
    setIsHovering(true);
    setVideoMounted(true);
  };

  const handleMouseLeave = () => {
    if (!hasVideo) return;
    setIsHovering(false);
  };

  return (
    <NavLink
      {...rest}
      to={"/projects/" + project.slug}
      className={`project__link project__link--${shape}${
        hidden ? " project__link--hidden" : ""
      }`}
      viewTransition
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      <article
        className="project__card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="project__card__image">
          <img
            src={project.projectImage}
            alt={`Image for ${project.name}`}
            style={project.imagePosition
              ? { objectPosition: project.imagePosition }
              : undefined}
          />
          {videoMounted && (
            <video
              src={project.projectVideo}
              poster={project.projectImage}
              autoPlay
              muted
              loop
              playsInline
              className={videoVisible ? "is-visible" : undefined}
              style={project.imagePosition
                ? { objectPosition: project.imagePosition }
                : undefined}
              aria-label={`Demo for ${project.name}`}
            />
          )}
        </div>
        <div className="project__card__label">
          {index != null && (
            <span className="project__card__index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <span className="project__card__name">{project.name}</span>
        </div>
        <div className="project__card__tags">
          {project.tags.slice(0, 3).map((tag: string, i: number) => {
            return (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const tags = searchParams.getAll("tags");
                  if (!tags.includes(tag)) {
                    tags.push(tag);
                    setSearchParams({ tags }, { preventScrollReset: true });
                  }
                }}
                key={i}
                className="project__card__tags__tag"
              >
                {tag}
              </button>
            );
          })}
        </div>
      </article>
    </NavLink>
  );
};

export default ProjectItem;
