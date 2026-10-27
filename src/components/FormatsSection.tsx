export default function FormatsSection() {
  const formats = [
    {
      icon: "🏫",
      title: "Présentiel",
      desc: "Des sessions dynamiques en petit groupe à Moroni, propices au networking, au mentorat et aux ateliers pratiques sur PC et smartphone.",
    },
    {
      icon: "💻",
      title: "En ligne",
      desc: "Suivez l'intégralité des modules en direct avec support interactif, accessible partout depuis les Comores ou la diaspora (France, Réunion, etc.).",
    },
    {
      icon: "🏢",
      title: "Pour entreprises",
      desc: "Des programmes personnalisés intra ou inter-entreprises pour former vos équipes marketing, commerciales ou managériales.",
    },
  ];

  return (
    <section className="alt" id="formats">
      <div className="w">
        <div className="sh">
          <small>Formats</small>
          <h2>Apprenez où et comment vous voulez</h2>
          <p>Une flexibilité totale conçue pour s’adapter à vos contraintes professionnelles et personnelles.</p>
        </div>

        <div className="fmt">
          {formats.map((fmt, idx) => (
            <div key={idx} className="card">
              <div className="ic" role="img" aria-label={fmt.title}>
                {fmt.icon}
              </div>
              <h3>{fmt.title}</h3>
              <p>{fmt.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
