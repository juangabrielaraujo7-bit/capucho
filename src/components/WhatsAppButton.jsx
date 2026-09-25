import { WhatsappLogo } from "@phosphor-icons/react";
import { wa } from "../config";

export default function WhatsAppButton({
  message,
  children = "Falar no WhatsApp",
  secondary = false,
}) {
  return (
    <a
      className={`button ${secondary ? "button-outline" : "button-primary"}`}
      href={wa(message)}
      target="_blank"
      rel="noreferrer"
    >
      <WhatsappLogo size={22} />
      {children}
    </a>
  );
}
