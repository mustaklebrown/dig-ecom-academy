import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <>
      <section className="hero" id="accueil">
        <div className="w">
          <div className="hg">
            <div>
              <div className="tag">
                <span>🇰🇲</span>
                <span>Formations professionnelles aux Comores</span>
              </div>

              <h1>
                Apprenez les compétences qui font <span>grandir votre avenir</span>.
              </h1>

              <p className="lead">
                Marketing digital, e-commerce, entrepreneuriat, art oratoire et développement personnel : des formations concrètes, animées par des praticiens, pour passer de l’idée à l’action.
              </p>

              <div className="cta">
                <a href="#formations" className="btn btn-p">
                  <span>Découvrir les formations</span>
                  <ArrowRight size={17} />
                </a>
                <a href="#contact" className="btn btn-l">
                  <span>Nous contacter</span>
                </a>
              </div>
            </div>

            <aside className="hcard" aria-label="Ce que vous obtenez avec Dig e-com Academy">
              <h3>
                <Sparkles size={20} color="var(--orange)" />
                <span>Ce que vous obtenez</span>
              </h3>
              <ul className="chk">
                <li>
                  <i>✓</i>
                  <span>Une pédagogie 100 % pratique, orientée résultats immédiats</span>
                </li>
                <li>
                  <i>✓</i>
                  <span>Des formateurs en activité, proches du terrain comorien</span>
                </li>
                <li>
                  <i>✓</i>
                  <span>Un accompagnement personnalisé avant, pendant et après la formation</span>
                </li>
                <li>
                  <i>✓</i>
                  <span>Une attestation de fin de formation valorisante pour votre carrière</span>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* Floating Key Stats Bar */}
      <div className="w stats">
        <div className="sg">
          <div>
            <b>6+</b>
            <span>Domaines de formation</span>
          </div>
          <div>
            <b>100 %</b>
            <span>Pratique &amp; Cas réels</span>
          </div>
          <div>
            <b>2</b>
            <span>Formats : présentiel &amp; en ligne</span>
          </div>
          <div>
            <b>1</b>
            <span>Objectif : votre réussite</span>
          </div>
        </div>
      </div>
    </>
  );
}
