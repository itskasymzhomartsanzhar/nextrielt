import mainImage from '../../assets/mainimg.png'
import mainicon from '../../assets/mainicon.png'
import mainicon2 from '../../assets/mainicon2.png'
import testicon from '../../assets/testicon.png'


import './TelegramHero.scss'

const benefits = [
  {
    id: 'cian-avito',
    parts: [
      { text: 'Подключается к вашему Циан и Авито, обрабатывая заявки ' },
      { text: '24/7', highlight: true },
      { text: ', без пропущенных лидов' },
    ],
  },
  {
    id: 'schedule',
    parts: [
      { text: 'Автоматически ' },
      { text: 'назначает показы и напоминает клиентам ', highlight: true },
      { text: 'о встрече в удобное для вас время' },
    ],
  },
  {
    id: 'conversion',
    parts: [
      { text: 'Увеличивает конверсию из заявки в показ до ' },
      { text: '30%', highlight: true },
      { text: ', экономит до ' },
      { text: '40–60 часов', highlight: true },
      { text: ' работы менеджеров, возвращает до ' },
      { text: '30%', highlight: true },
      { text: ' потерянных лидов' },
    ],
  },
]

export default function TelegramHero() {
  return (
    <section className="telegram-hero" aria-labelledby="telegram-hero-title">
      <div className="telegram-hero__inner">
        <div className="telegram-hero__content">
          <div className="hero-heading">
            <h1 className="hero-heading__title" id="telegram-hero-title">
              <span className="hero-heading__line">Увеличим продажи</span>
                <span className="hero-heading__line">на 30% через</span>
              <span className="hero-heading__line">
                <span className="hero-heading__telegram">
                  ИИ-риелтора
                   <img className="hero-heading__telegram-icon" src={mainicon} alt="" />
                   <img className="hero-heading__telegram-icon" src={mainicon2} alt="" />

                </span>
              </span>
              <span className="hero-heading__line">для входящих заявок</span>

            </h1>


          </div>

          <ul className="hero-benefits" aria-label="Преимущества">
            {benefits.map((benefit) => (
              <li className="hero-benefits__item" key={benefit.id}>
                <span className="hero-benefits__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_5_1345)">
                      <path d="M14.6667 7.38668V8.00001C14.6658 9.43763 14.2003 10.8365 13.3396 11.9879C12.4788 13.1393 11.2689 13.9817 9.89023 14.3893C8.51162 14.7969 7.03817 14.7479 5.68964 14.2497C4.34112 13.7515 3.18976 12.8307 2.4073 11.6247C1.62484 10.4187 1.25319 8.99205 1.34778 7.55755C1.44237 6.12305 1.99813 4.75756 2.93218 3.66473C3.86623 2.57189 5.12852 1.81027 6.53079 1.49344C7.93306 1.17662 9.40017 1.32157 10.7133 1.90668M14.6667 2.66668L8 9.34001L6 7.34001" stroke="#0468FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_5_1345">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>

                <span className="hero-benefits__text">
                  {benefit.parts.map((part, index) =>
                    part.highlight ? (
                      <strong key={`${benefit.id}-part-${index}`}>{part.text}</strong>
                    ) : (
                      <span key={`${benefit.id}-part-${index}`}>{part.text}</span>
                    )
                  )}
                </span>
              </li>
            ))}
          </ul>

          <div className="hero-actions">
            <a className="hero-actions__button hero-actions__button--primary" href="#trial">
              <img className="hero-actions__icon" src={testicon} alt="" aria-hidden="true" />
              Протестировать
            </a>

            <a className="hero-actions__button hero-actions__button--secondary" href="https://t.me/swift_manager">
                <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.499172 7.2935C0.542806 7.2713 0.586459 7.25021 0.629001 7.23023C1.36858 6.88169 2.11798 6.55536 2.86629 6.22902C2.90665 6.22902 2.97427 6.18129 3.01245 6.16575C3.07026 6.14022 3.12808 6.1158 3.1859 6.09027C3.29716 6.04143 3.40843 5.9937 3.5186 5.94486C3.74113 5.84829 3.96256 5.75171 4.18509 5.65514L5.51698 5.07462C6.40492 4.68834 7.29396 4.30095 8.1819 3.91467C9.06983 3.52839 9.95885 3.141 10.8468 2.75472C11.7347 2.36844 12.6237 1.98106 13.5117 1.59478C14.3996 1.2085 15.2886 0.821113 16.1766 0.434834C16.374 0.348254 16.5878 0.219492 16.7994 0.181752C16.9772 0.149562 17.1507 0.0874049 17.3296 0.052995C17.6688 -0.0124948 18.043 -0.0391323 18.368 0.104057C18.4804 0.154007 18.584 0.223936 18.6702 0.311626C19.0825 0.726765 19.0247 1.4083 18.9375 1.99216C18.3299 6.0614 17.7223 10.1318 17.1136 14.201C17.0307 14.7593 16.9172 15.3721 16.4842 15.725C16.1177 16.0236 15.5962 16.0569 15.1435 15.9304C14.6909 15.8027 14.2916 15.5352 13.9 15.2722C12.2758 14.1777 10.6504 13.0832 9.0262 11.9888C8.64005 11.729 8.21026 11.3894 8.21463 10.9176C8.21681 10.6335 8.38369 10.3804 8.55386 10.1551C9.96539 8.2814 12.002 6.9938 13.5171 5.20671C13.7309 4.95474 13.8989 4.49964 13.6055 4.35423C13.431 4.26765 13.2302 4.38531 13.071 4.49742C11.0682 5.91266 9.06656 7.32902 7.0638 8.74427C6.41039 9.20603 5.72535 9.68111 4.93777 9.79433C4.2331 9.89645 3.52406 9.69664 2.8423 9.4924C2.2707 9.32146 1.70018 9.14608 1.13186 8.96516C0.829699 8.8697 0.51772 8.76647 0.284282 8.55002C0.050845 8.33357 -0.0833088 7.96949 0.0574081 7.68089C0.145765 7.49996 0.317029 7.38563 0.497015 7.29239L0.499172 7.2935Z" fill="#383838"/>
</svg>

              Написать в Telegram
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <img className="hero-visual__image" src={mainImage} alt="" />
        </div>
      </div>
    </section>
  )
}
