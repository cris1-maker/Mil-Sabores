export default function SocialButton() {
  return (
    <div className="social-buttons-vertical">
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noreferrer"
        className="btn-floating blue darken-4"
      >
        <i className="fab fa-facebook-f"></i>
      </a>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noreferrer"
        className="btn-floating pink lighten-2"
      >
        <i className="fab fa-instagram"></i>
      </a>
      <a
        href="https://wa.me/56912345678"
        target="_blank"
        rel="noreferrer"
        className="btn-floating gradient-green"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
}
