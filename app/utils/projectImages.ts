import waqtWebLogo from "../content/projects/img/waqt-web-logo.png";
import waqtWeb from "../content/projects/img/waqt-web.png";
import tallyCounterLogo from "../content/projects/img/tally-counter-logo.png";
import tallyCounter from "../content/projects/img/tally-counter.png";
import amarRapidPassLogo from "../content/projects/img/amar-rapid-pass-logo.png";
import amarRapidPass from "../content/projects/img/amar-rapid-pass.jpg";
import rbdsLogo from "../content/projects/img/rbds-logo.png";
import rbds from "../content/projects/img/rbds.png";
import flutterMovies from "../content/projects/img/flutter-movies.png";
import mymLogo from "../content/projects/img/mym-logo.png";
import mym from "../content/projects/img/mym.png";
import multistreamerLogo from "../content/projects/img/multistreamer-logo.png";
import multistreamer from "../content/projects/img/multistreamer.png";

const projectImages: Record<string, any> = {
  "waqt-web.png": waqtWeb,
  "tally-counter.png": tallyCounter,
  "amar-rapid-pass.jpg": amarRapidPass,
  "rbds.png": rbds,
  "flutter-movies.png": flutterMovies,
  "mym.png": mym,
  "multistreamer.png": multistreamer,
};

const logoImages: Record<string, any> = {
  "waqt-web-logo.png": waqtWebLogo,
  "tally-counter-logo.png": tallyCounterLogo,
  "amar-rapid-pass-logo.png": amarRapidPassLogo,
  "rbds-logo.png": rbdsLogo,
  "mym-logo.png": mymLogo,
  "multistreamer-logo.png": multistreamerLogo,
};

export function getProjectImage(filename: string): any {
  return projectImages[filename];
}

export function getLogoImage(filename: string): any {
  return logoImages[filename];
}
