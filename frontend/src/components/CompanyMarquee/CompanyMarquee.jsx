import company1 from '../../assets/company1.png'
import company2 from '../../assets/company2.png'
import company3 from '../../assets/company3.png'
import company4 from '../../assets/company4.png'
import company5 from '../../assets/company5.png'
import company6 from '../../assets/company6.png'
import './CompanyMarquee.scss'

const logos = [
  { id: 'kubkoff', src: company1, alt: 'Кубкофф' },
  { id: 'hmeli', src: company2, alt: 'Хмели Сунели' },
  { id: 'delomax', src: company3, alt: 'Деломакс' },
  { id: 'etazhi', src: company4, alt: 'Этажи' },
  { id: 'durex', src: company5, alt: 'Durex' },
  { id: 'revv', src: company6, alt: 'Revv' },
]

export default function CompanyMarquee() {
  return (
    <section className="company-marquee">
      <div className="company-marquee__inner">
        <h2 className="company-marquee__title">
          Наши ИИ-решения используют <br />
          <span>десятки компаний</span>
        </h2>

        <div className="company-marquee__track" aria-label="Компании">
          <div className="company-marquee__row">
            <ul className="company-marquee__list">
              {logos.map((logo) => (
                <li key={logo.id} className="company-marquee__item">
                  <img src={logo.src} alt={logo.alt} />
                </li>
              ))}
            </ul>
            <ul className="company-marquee__list" aria-hidden="true">
              {logos.map((logo) => (
                <li key={`${logo.id}-clone`} className="company-marquee__item">
                  <img src={logo.src} alt="" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
