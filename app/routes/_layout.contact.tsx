/// <reference types="cloudflare-turnstile" />
/// <reference types="node" />

import {
  data,
  Form,
  useActionData,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router";
import { Resend } from "resend";
import { invariantResponse } from "@epic-web/invariant";
import { useEffect, useState } from "react";
import "../styles/contact.scss";

export function meta() {
  return [
    { title: "Contact — Tamim Arafat" },
    { name: "description", content: "Contact page for Tamim Arafat" },
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
    invariantResponse(secretKey != null, "Missing Turnstile secret key");

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
    invariantResponse(
      result.success,
      `Turnstile verification failed: ${result["error-codes"].join(", ")}`,
    );
  } catch (error) {
    return data({
      success: false,
      message: error,
    });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const toEmail = process.env.RESEND_TO_EMAIL;

    const { data: responseData, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: toEmail != null ? [toEmail] : [],
      subject: `Message from ${name} (${email})`,
      text: message.toString(),
    });

    if (error != null) {
      console.error(error);
      return data({
        success: false,
        message: error,
      });
    }

    if (responseData != null) {
      console.log("Email sent:", responseData);
      return data({
        success: true,
        message: "Message sent successfully!",
      });
    }
  } catch (e) {
    console.error(e);
    return data({
      success: false,
      message: e,
    });
  }
};

export default function Contact() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

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

  useEffect(() => {
    ((window as any).turnstile as Turnstile.Turnstile).render(
      "#turnstile-container",
      {
        sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
        callback: handleTurnstileSuccess,
        size: "flexible",
        theme: "auto",
        appearance: "execute",
      },
    );
  }, []);

  return (
    <div className="contact-page">
      <p className="contact-page__description animate__animated animate__fadeInUp animate__faster prose">
        If you have any questions or would like to get in touch, feel free to
        {turnstileSuccess ? (
          <>
            <a href={`mailto:${emailAddress}`}> send me an email</a> or
          </>
        ) : null}{" "}
        reach out using the form below. I&apos;ll do my best to get back to you
        as soon as possible.
      </p>

      <Form
        action="/contact"
        method="post"
        className="contact-page__form animate__animated animate__fadeInUp animate__faster"
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
          ></textarea>
        </div>

        {actionData?.success != null && (
          <div className="contact-page__notification">
            {actionData.message as string}
          </div>
        )}

        <div id="turnstile-container"></div>

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
