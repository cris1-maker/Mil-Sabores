export default function Footer() {
  return (
    <footer
      dangerouslySetInnerHTML={{ __html: `<footer class="page-footer transparent z-depth-5">
    <div class="container center-align">
      <p>&copy; 2025 Pastelería Mil Sabores. Todos los derechos reservados.</p>
    </div>
  </footer>` }}
    />
  );
}
