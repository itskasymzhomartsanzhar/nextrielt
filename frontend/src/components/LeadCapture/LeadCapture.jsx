import { useState } from 'react'
import mainImage from '../../assets/leadmain.png'
import './LeadCapture.scss'

export default function LeadCapture() {
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [showThanks, setShowThanks] = useState(false)
  const isPhoneFilled = phone.trim().length > 0

  const formatPhoneFromDigits = (digits) => {
    const rest = digits.slice(1)

    let formatted = `+${digits[0]}`
    if (rest.length > 0) {
      formatted += ` (${rest.slice(0, 3)}`
    }
    if (rest.length >= 3) {
      formatted += ')'
    }
    if (rest.length > 3) {
      formatted += ` ${rest.slice(3, 6)}`
    }
    if (rest.length > 6) {
      formatted += `-${rest.slice(6, 8)}`
    }
    if (rest.length > 8) {
      formatted += `-${rest.slice(8, 10)}`
    }

    return formatted
  }

  const handlePhoneChange = (event) => {
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle')
    }
    const raw = event.target.value
    const digitsOnly = raw.replace(/\D/g, '')
    const isDeleting = raw.length < phone.length

    if (!digitsOnly) {
      setPhone('')
      return
    }

    if (isDeleting && digitsOnly.length <= 1) {
      setPhone('')
      return
    }

    let digits = digitsOnly
    if (digits[0] === '8') {
      digits = `7${digits.slice(1)}`
    } else if (digits[0] !== '7') {
      digits = `7${digits}`
    }

    digits = digits.slice(0, 11)
    setPhone(formatPhoneFromDigits(digits))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    const formData = new FormData(event.currentTarget)
    const telegram = String(formData.get('telegram') || '').trim()
    const phoneValue = phone.trim()

    const digits = phoneValue.replace(/\D/g, '')
    if (!phoneValue || digits.length < 10) {
      setSubmitStatus('invalid')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('loading')

    try {
      const apiBase = import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL || ''
      const sourceUrl = window.location.href
      const endpoint = apiBase ? `${apiBase}/api/leads/` : '/api/leads/'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegram, phone: phoneValue, source_url: sourceUrl }),
      })

      if (!response.ok) {
        setSubmitStatus('error')
        return
      }

      setSubmitStatus('success')
      setShowThanks(true)
      setTimeout(() => setShowThanks(false), 2000)
      setPhone('')
      event.currentTarget.reset()
    } catch (error) {
      // Не показываем ошибку без подтвержденного ответа сервера
      setSubmitStatus('idle')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="lead-capture" id="request">
      <div className="lead-capture__inner">
        <div className="lead-capture__content">
          <h2 className="lead-capture__title">
            Закрывайте <span>больше сделок</span> уже
            <br />
            завтра с вашим ИИ-риелтором
          </h2>

          <form className="lead-capture__form" onSubmit={handleSubmit}>
            <label className="lead-capture__label" htmlFor="telegram-nick">
              Ваш Telegram
            </label>
            <input
              className="lead-capture__input"
              id="telegram-nick"
              name="telegram"
              placeholder="@swift_manager"
              type="text"
              autoComplete="username"
              onChange={() => {
                if (submitStatus !== 'idle') {
                  setSubmitStatus('idle')
                }
              }}
            />

            <label className="lead-capture__label" htmlFor="phone">
              Номер телефона
            </label>
            <input
              className="lead-capture__input"
              id="phone"
              name="phone"
              placeholder="+7999999999"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={handlePhoneChange}
            />

            <button className="lead-capture__submit" type="submit" disabled={!isPhoneFilled || isSubmitting}>
              {showThanks ? 'Спасибо' : isSubmitting ? 'Отправляем...' : 'Отправить'}
            </button>
            {submitStatus === 'success' ? (
              <span className="lead-capture__status lead-capture__status--success">
                Заявка отправлена
              </span>
            ) : null}
            {submitStatus === 'error' ? (
              <span className="lead-capture__status lead-capture__status--error">
                Не удалось отправить. Попробуйте ещё раз.
              </span>
            ) : null}
            {submitStatus === 'invalid' ? (
              <span className="lead-capture__status lead-capture__status--error">
                Укажите номер телефона.
              </span>
            ) : null}
          </form>

        </div>

        <div className="lead-capture__visual" aria-hidden="true">
          <img src={mainImage} alt="" />
        </div>
      </div>
    </section>
  )
}
