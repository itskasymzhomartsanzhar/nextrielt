import featuresChat from '../../assets/chat.png'
import featuresPhone from '../../assets/phone2.png'
import featureCian from '../../assets/icons.png'
import featureAvito from '../../assets/feature2.png'
import featureLead from '../../assets/leadimg.png'
import featureCalendar from '../../assets/calendar.png'
import './Features.scss'

export default function Features() {
  return (
    <section className="features" id="features" aria-labelledby="features-title">
      <div className="features__inner">
        <h2 className="features__title" id="features-title">
          Возможности
        </h2>

        <div className="features__grid">
          <article className="feature-card feature-card--cian">
            <p className="feature-card__text">
              Сам ведет переписки
              <br />
              с клиентами на <strong>Циан и Авито</strong>
            </p>
            <div className="feature-card__logos" aria-hidden="true">
              <img className="feature-card__logo feature-card__logo--cian" src={featureCian} alt="" />
            </div>
          </article>

          <article className="feature-card feature-card--dialogue">
            <p className="feature-card__text">
              Квалифицирует лида, догревает заявки до показа, и присылает{' '}
              <strong>уведомление в Telegram</strong>
            </p>
            <div className="feature-card__media">
              <img src={featuresChat} alt="" loading="lazy" />
            </div>
          </article>

          <article className="feature-card feature-card--phone">
            <div className="feature-card__phone">
              <img src={featuresPhone} alt="" loading="lazy" />
            </div>
            <p className="feature-card__text feature-card__text--compact">
              Отвечает как <strong>премиум-риелтор</strong> <strong>24/7</strong> за
              &nbsp;&lt;5 секунд, повышая конверсию
            </p>
          </article>

          <article className="feature-card feature-card--leads">
            <p className="feature-card__text">
              Генерирует более заинтересованные и <strong>теплые <br /> лиды</strong> для
              продаж
            </p>
            <div className="feature-card__illustration" aria-hidden="true">
              <img src={featureLead} alt="" loading="lazy" />
            </div>
          </article>

          <article className="feature-card feature-card--time">
            <div className="feature-card__illustration feature-card__illustration--calendar" aria-hidden="true">
              <img src={featureCalendar} alt="" loading="lazy" />
            </div>
            <p className="feature-card__text">
              Экономит до <strong>40 часов</strong> работы менеджеров в месяц
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
