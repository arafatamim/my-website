import { FaLaptop, FaMoon, FaSun } from "react-icons/fa6";
import "./ThemeSelector.scss";
import type { Theme } from "~/utils/theme.server";
import "animate.css";

const modeIcon = {
  light: FaSun,
  dark: FaMoon,
  system: FaLaptop,
};

const modeLabel = {
  light: "Light Theme",
  dark: "Dark Theme",
  system: "System Theme",
};

export default function ThemeSelector({ mode }: { mode: Theme | "system" }) {
  const IconComponent = modeIcon[mode];

  return (
    <button className="theme-selector animate__animated animate__fadeIn">
      <IconComponent className="theme-selector__icon" />
      <span className="theme-selector__label">{modeLabel[mode]}</span>
    </button>
  );
}
