export default function WhyChooseUs() {
  const pillars = [
    {
      icon: "🎯",
      title: "Contenu concret",
      desc: "Zéro théorie inutile. Chaque notion théorique est immédiatement mise en application sur des projets réels.",
    },
    {
      icon: "🤝",
      title: "Accompagnement humain",
      desc: "Des formateurs passionnés, disponibles pour répondre à vos questions même après la fin de la session.",
    },
    {
      icon: "📱",
      title: "Adapté au contexte local",
      desc: "Des stratégies efficaces conçues pour l’écosystème comorien : WhatsApp Business, Facebook Ads local et mobile money.",
    },
    {
      icon: "🏅",
      title: "Attestation reconnue",
      desc: "Une preuve tangible de savoir-faire pour valoriser votre CV, rassurer vos futurs employeurs ou signer vos premiers clients.",
    },
  ];

  return (
    <section id="pourquoi">
      <div className="w">
        <div className="sh">
          <small>Pourquoi nous choisir</small>
          <h2>Une académie pensée pour la réalité des Comores</h2>
          <p>Nous combinons standards professionnels internationaux et compréhension intime du marché comorien.</p>
        </div>

        <div className="why">
          {pillars.map((item, idx) => (
            <div key={idx} className="card">
              <div className="ic" role="img" aria-label={item.title}>
                {item.icon}
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
