/// <reference types="cloudflare-turnstile" />
/// <reference types="node" />

import {
  type ActionFunctionArgs,
  data,
  Form,
  useActionData,
  useNavigation,
} from "react-router";
import { Resend } from "resend";
import { invariantResponse } from "@epic-web/invariant";
import { useEffect, useRef, useState } from "react";
import "../styles/contact.scss";
import { gsap, isFirstLoad, SplitText, useGSAP } from "../utils/gsap";
import { absoluteUrl, default as siteMetadata } from "../meta";

export function meta() {
  const title = "Contact — Tamim Arafat";
  const description =
    "Get in touch with Tamim Arafat for collaborations, freelance work, or any inquiries about web and mobile development.";
  const url = absoluteUrl("/contact");

  return [
    { title },
    { name: "description", content: description },
    { rel: "canonical", href: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: siteMetadata.title },
    { property: "og:image", content: absoluteUrl("/og-image.png") },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:image", content: absoluteUrl("/og-image.png") },
    { name: "twitter:site", content: "@_arafatamim_" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

type TurnstileResponse = {
  success: boolean;
  hostname: string;
  ["error-codes"]: string[];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  const turnstileToken = formData.get("cf-turnstile-response");

  invariantResponse(
    name != null && email != null && message != null,
    "Missing form data",
  );

  invariantResponse(turnstileToken != null, "Missing Turnstile token");

  try {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (secretKey == null) {
      console.error("Missing TURNSTILE_SECRET_KEY");
      return data({
        success: false,
        message: "Turnstile is not configured on the server.",
      });
    }

    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", turnstileToken);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      },
    );
    const result: TurnstileResponse = await response.json();
    if (!result.success) {
      console.error("Turnstile validation failed", result);
      const errorCodes = result["error-codes"];
      return data({
        success: false,
        message: `Human verification failed: ${
          errorCodes.length > 0 ? errorCodes.join(", ") : "unknown error"
        }`,
      });
    }
  } catch (error) {
    console.error("Turnstile request failed", error);
    return data({
      success: false,
      message: "Human verification failed. Please try again.",
    });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const toEmail = process.env.RESEND_TO_EMAIL;

    const { data: responseData, error } = await resend.emails.send({
      from:
        `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: toEmail != null ? [toEmail] : [],
      subject: `Message from ${name} (${email})`,
      text: message.toString(),
    });

    if (error != null) {
      console.error("Resend send failed", error);
      return data({
        success: false,
        message: typeof error.message === "string"
          ? `Failed to send message: ${error.message}`
          : "Failed to send message. Please try again later.",
      });
    }

    if (responseData != null) {
      console.log("Email sent:", responseData);
      return data({
        success: true,
        message: "Message sent successfully!",
      });
    }

    console.error("Resend send returned no data and no error");
    return data({
      success: false,
      message: "Failed to send message. No response from email provider.",
    });
  } catch (e) {
    console.error("Resend request failed", e);
    return data({
      success: false,
      message: e instanceof Error && e.message
        ? `Failed to send message: ${e.message}`
        : "An unexpected error occurred. Please try again later.",
    });
  }
};

export default function Contact() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const scope = useRef<HTMLDivElement>(null);

  // no SplitText here: the description re-renders when Turnstile succeeds,
  // so React must keep ownership of its DOM
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(scope.current, { visibility: "visible" });
        // title + underline animate on every visit (they ride the page slide);
        // the rest of the intro only on a cold load.
        // title is static text, safe to split (unlike the description)
        SplitText.create(".contact-page__title__text", {
          type: "chars",
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 70,
              autoAlpha: 0,
              filter: "blur(10px)",
              duration: 1,
              stagger: 0.035,
              ease: "power3.out",
              delay: 0.1,
            }),
        });
        gsap.fromTo(
          ".contact-page__underline path",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.9,
            delay: 0.5,
            ease: "power2.out",
            autoRound: false, // sub-pixel draw (pathLength=1)
          },
        );
        const intro = isFirstLoad();
        if (intro) {
          gsap.set(".contact-page__description", { y: 28, autoAlpha: 0 });
          gsap.to(".contact-page__description", {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            delay: 0.3,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
          });
        }
        if (intro) {
          gsap.set(".contact-page__form > *", { y: 26, autoAlpha: 0 });
          gsap.to(".contact-page__form > *", {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.09,
            delay: 0.25,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
          });
        }
      });
    },
    { scope },
  );

  const [emailAddress, setEmailAddress] = useState("");
  const [turnstileSuccess, setTurnstileSuccess] = useState<boolean>(false);

  const handleTurnstileSuccess = (_token: string) => {
    setTurnstileSuccess(true);
  };

  useEffect(() => {
    const encoded = "dGFtaW0uYXJhZmF0QG91dGxvb2suY29t";

    const m = atob(encoded);

    setEmailAddress(m);
  }, []);

  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const renderTurnstile = () => {
      if ((window as any).turnstile && turnstileRef.current) {
        if (widgetIdRef.current) {
          ((window as any).turnstile as Turnstile.Turnstile).remove(
            widgetIdRef.current,
          );
        }
        widgetIdRef.current = (
          (window as any).turnstile as Turnstile.Turnstile
        ).render(turnstileRef.current, {
          sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
          callback: handleTurnstileSuccess,
          "error-callback": () => setTurnstileSuccess(false),
          "expired-callback": () => setTurnstileSuccess(false),
          "timeout-callback": () => setTurnstileSuccess(false),
          size: "flexible",
          theme: "auto",
          appearance: "execute",
        });
      }
    };

    if ((window as any).turnstile) {
      renderTurnstile();
    } else {
      window.addEventListener("load", renderTurnstile);
    }

    return () => {
      if (widgetIdRef.current && (window as any).turnstile) {
        ((window as any).turnstile as Turnstile.Turnstile).remove(
          widgetIdRef.current,
        );
        widgetIdRef.current = undefined;
      }
      window.removeEventListener("load", renderTurnstile);
    };
  }, []);

  return (
    <div className="contact-page" ref={scope}>
      <h1 className="contact-page__title">
        <span className="contact-page__title__text">Get in Touch</span>
      </h1>
      <div className="contact-page__description-wrapper">
        <p className="contact-page__description prose">
          If you have any questions or would like to get in touch, feel free to
          {turnstileSuccess
            ? (
              <>
                <a href={`mailto:${emailAddress}`}>{" "}send me an email</a> or
              </>
            )
            : null}{" "}
          reach out using the form below. I&apos;ll do my best to get back to
          you as soon as possible.
        </p>
        <svg
          className="contact-page__underline"
          viewBox="0 -25 400 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 5 C5 -8, 10 30, 15 5 C22 -25, 30 15, 38 5 C45 -18, 55 35, 65 5 C75 -12, 90 18, 105 5 C118 -28, 135 32, 150 5 C165 -15, 185 22, 205 5 C222 -20, 242 35, 260 5 C278 -10, 300 15, 320 5 C338 -22, 355 28, 375 5 C388 -18, 395 20, 400 5"
            fill="none"
            stroke="var(--accent-2)"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength="1"
          />
        </svg>
      </div>

      <Form
        action="/contact"
        method="post"
        className="contact-page__form"
      >
        <div className="contact-page__form-group">
          <label htmlFor="name" className="contact-page__label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="contact-page__input"
          />
        </div>

        <div className="contact-page__form-group">
          <label htmlFor="email" className="contact-page__label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="contact-page__input"
          />
        </div>

        <div className="contact-page__form-group">
          <label htmlFor="message" className="contact-page__label">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="contact-page__textarea"
          >
          </textarea>
        </div>

        {actionData?.success != null && (
          <div className="contact-page__notification">
            {actionData.message as string}
          </div>
        )}

        <div ref={turnstileRef} />

        <button
          type="submit"
          disabled={isSubmitting || !turnstileSuccess}
          className="contact-page__button"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </Form>
    </div>
  );
}
