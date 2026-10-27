export default function MethodTimeline() {
  const steps = [
    {
      num: 1,
      title: "Échange",
      desc: "Vous nous contactez, nous cernons ensemble votre profil, vos ambitions et votre objectif.",
    },
    {
      num: 2,
      title: "Inscription",
      desc: "Vous choisissez la formation et le format adapté (présentiel ou en ligne) à votre rythme.",
    },
    {
      num: 3,
      title: "Pratique",
      desc: "Des cours courts, des ateliers intensifs et des cas concrets comoriens à chaque session.",
    },
    {
      num: 4,
      title: "Attestation",
      desc: "Vous repartez certifié et immédiatement opérationnel pour lancer ou booster votre activité.",
    },
  ];

  return (
    <section className="alt" id="methode">
      <div className="w">
        <div className="sh">
          <small>Notre méthode</small>
          <h2>Un parcours simple, en 4 étapes</h2>
          <p>Une progression pensée pour vous emmener de la découverte à la maîtrise concrète.</p>
        </div>

        <div className="steps">
          {steps.map((st) => (
            <div key={st.num} className="step">
              <h3>{st.title}</h3>
              <p>{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
