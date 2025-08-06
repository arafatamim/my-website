import waqtWebLogo from "../content/projects/img/waqt-web-logo.png";
import waqtWeb from "../content/projects/img/waqt-web.webp";
import tallyCounterLogo from "../content/projects/img/tally-counter-logo.png";
import tallyCounter from "../content/projects/img/tally-counter.png";
import amarRapidPassLogo from "../content/projects/img/amar-rapid-pass-logo.png";
import amarRapidPass from "../content/projects/img/amar-rapid-pass.webp";
import freightAway from "../content/projects/img/freight-away.webp";
import goodlink from "../content/projects/img/goodlink.webp";
import rbdsLogo from "../content/projects/img/rbds-logo.png";
import rbds from "../content/projects/img/rbds.webp";
import flutterMovies from "../content/projects/img/flutter-movies.webp";
import mymLogo from "../content/projects/img/mym-logo.png";
import mym from "../content/projects/img/mym.webp";
import multistreamerLogo from "../content/projects/img/multistreamer-logo.png";
import multistreamer from "../content/projects/img/multistreamer.webp";

const projectImages: Record<string, any> = {
  "waqt-web.webp": waqtWeb,
  "tally-counter.png": tallyCounter,
  "amar-rapid-pass.webp": amarRapidPass,
  "freight-away.webp": freightAway,
  "goodlink.webp": goodlink,
  "rbds.webp": rbds,
  "flutter-movies.webp": flutterMovies,
  "mym.webp": mym,
  "multistreamer.webp": multistreamer,
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
