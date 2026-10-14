import { PinIcon, ClockIcon, PhoneIcon, CameraIcon, WineIcon, MailIcon } from "./Icons.jsx";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <span className="site-footer__rule" aria-hidden="true" />
      <ul className="site-footer__info">
       <li><PinIcon width={16} height={16} /> Coastal Road, Kannur, Kerala, India</li>
        <li><ClockIcon width={16} height={16} /> Monday–Sunday · 12:00 PM–10:30 PM </li>
        <li><PhoneIcon width={16} height={16} /> +91 98765 43210 · hello@flavourjunction.com</li>
      </ul>

      <div className="site-footer__social">
        <a href="#" aria-label="Instagram"><CameraIcon width={18} height={18} /></a>
        <a href="#" aria-label="Wine list"><WineIcon width={18} height={18} /></a>
        <a href="mailto:reservations@flavourjunction.com" aria-label="Email"><MailIcon width={18} height={18} /></a>
      </div>

      <p className="site-footer__copy">
        © {new Date().getFullYear()} Flavour Junction. Fine hospitality &amp; guest dialogue system.
      </p>
    </footer>
  );
}
