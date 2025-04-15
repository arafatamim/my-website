import { invariantResponse } from "@epic-web/invariant";
import { data, useFetcher, type ActionFunctionArgs } from "react-router";
import { useHints } from "~/utils/clientHints";
import { useRequestInfo } from "~/utils/requestInfo";
import { setTheme, type Theme } from "~/utils/theme.server";
import ThemeSelector from "~/components/ThemeSelector";
import "animate.css";

/**
 * @returns the client hint theme.
 */
export function useTheme() {
  const hints = useHints();
  const requestInfo = useRequestInfo();
  return requestInfo.userPrefs.theme ?? hints.theme;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const theme = formData.get("theme");

  invariantResponse(
    theme?.toString() == "system" ||
      theme?.toString() == "light" ||
      theme?.toString() == "dark",
    "Invalid theme received"
  );

  const responseInit = {
    headers: { "set-cookie": setTheme(theme as unknown as Theme) },
  };
  return data({ result: theme }, responseInit);
}

export function ThemeSwitch({
  userPreference,
}: {
  userPreference?: Theme | null;
}) {
  const fetcher = useFetcher<typeof action>();

  const mode = userPreference ?? "system";
  const nextMode =
    mode === "system" ? "light" : mode === "light" ? "dark" : "system";

  return (
    <fetcher.Form method="POST" action="/resources/theme-switch">
      <input type="hidden" name="theme" value={nextMode} />
      <div>
        <ThemeSelector mode={mode} />
      </div>
    </fetcher.Form>
  );
}
