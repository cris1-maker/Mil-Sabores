export default function Card({ title, image, children }) {
  return (
    <article className="card">
      {image && <img src={image} alt={title || 'card'} />}
      {title && <h3>{title}</h3>}
      <div className="card-content">{children}</div>
    </article>
  );
}
