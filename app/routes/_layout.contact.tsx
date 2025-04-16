import {
  data,
  Form,
  useActionData,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router";
import { Resend } from "resend";
import "../styles/contact.scss";
import { invariantResponse } from "@epic-web/invariant";

export function meta() {
  return [
    { title: "Contact — Tamim Arafat" },
    { name: "description", content: "Contact page for Tamim Arafat" },
  ];
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  invariantResponse(
    name != null && email != null && message != null,
    "Missing form data"
  );

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
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="contact-page">
      <p className="contact-page__description animate__animated animate__fadeInUp animate__faster prose">
        If you have any questions or would like to get in touch, feel free to
        reach out to me using the form below. I&apos;ll do my best to get back
        to you as soon as possible.
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
          <div className="contact-page__notification">{actionData.message}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="contact-page__button"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </Form>
    </div>
  );
}
