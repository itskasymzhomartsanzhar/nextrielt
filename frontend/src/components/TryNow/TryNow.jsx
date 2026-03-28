import { useState } from 'react'
import chatPattern from '../../assets/background.png'
import avatar from '../../assets/avatar.png'
import rentIcon from '../../assets/renticon.png'
import photo1 from '../../assets/photo1.png'
import photo2 from '../../assets/photo2.png'
import photo3 from '../../assets/photo3.png'

import './TryNow.scss'

export default function TryNow() {
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const apiBase = import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL || ''
  const endpoint = apiBase ? `${apiBase}/api/chat/` : '/api/chat/'
  const maxContext = 12

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isSending) return
    const trimmed = messageText.trim()
    if (!trimmed) return

    const userMessage = {
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: 'out',
      text: trimmed,
    }
    const assistantId = `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const pendingMessage = { id: assistantId, type: 'in', text: '...', pending: true }

    const contextMessages = [...messages, userMessage]
      .filter((item) => !item.pending)
      .slice(-maxContext)
      .map((item) => ({
        role: item.type === 'out' ? 'user' : 'assistant',
        content: item.text,
      }))

    setMessages((prev) => [...prev, userMessage, pendingMessage])
    setMessageText('')

    setIsSending(true)
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: contextMessages }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const reply = data?.reply?.trim()
        setMessages((prev) =>
          prev.map((item) =>
            item.id === assistantId
              ? {
                  ...item,
                  text: reply || 'Не удалось получить ответ. Попробуйте ещё раз.',
                  pending: false,
                }
              : item,
          ),
        )
      })
      .catch(() => {
        setMessages((prev) =>
          prev.map((item) =>
            item.id === assistantId
              ? { ...item, text: 'Ошибка соединения. Попробуйте ещё раз.', pending: false }
              : item,
          ),
        )
      })
      .finally(() => {
        setIsSending(false)
      })
  }

  return (
    <section className="try-now" id="trial" aria-labelledby="try-now-title">
      <div className="try-now__inner">
        <header className="try-now__header">
          <h2 className="try-now__title" id="try-now-title">
            Попробуйте сейчас
          </h2>
          <p className="try-now__subtitle">
            Начните диалог с ИИ-риелтором. Данные об объекте <strong>тестовые</strong>!
          </p>
        </header>

        <div className="try-now__content">
          <div className="try-chat" style={{ '--chat-bg': `url(${chatPattern})` }}>
            <div className="try-chat__header">
              <img className="try-chat__avatar" src={avatar} alt="" />
              <div className="try-chat__meta">
                <span className="try-chat__name">Александра</span>
                <span className="try-chat__status">В сети</span>
              </div>
            </div>

            <div className="try-chat__messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`try-chat__bubble try-chat__bubble--${message.type}${
                    message.pending ? ' is-pending' : ''
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <form className="try-chat__composer" onSubmit={handleSubmit}>
              <div className="try-chat__input">
                <input
                  type="text"
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder="Напишите сообщение"
                  aria-label="Сообщение"
                  disabled={isSending}
                />
              </div>
              <button
                className="try-chat__send"
                type="submit"
                aria-label="Отправить"
                disabled={isSending || !messageText.trim()}
              >
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M18.2117 3.01839C19.9382 2.51026 21.5296 4.11864 21.0265 5.8382L16.8662 20.0689C16.3142 21.9556 13.7907 22.2993 12.7596 20.6215L9.21913 14.8597L3.47698 11.3075C1.80846 10.275 2.14492 7.7478 4.02873 7.19284L18.2117 3.01839ZM19.6444 5.43386C19.8306 4.79724 19.242 4.21625 18.6183 4.3998L4.43566 8.57415C4.4356 8.57416 4.43571 8.57413 4.43566 8.57415C3.74907 8.77657 3.62222 9.70394 4.23463 10.0829L10.122 13.7249C10.2175 13.784 10.2978 13.8646 10.3566 13.9603L13.9864 19.8676C14.3618 20.4783 15.2813 20.3572 15.4841 19.6648L19.6444 5.43386Z" fill="white"/>
<path fillRule="evenodd" clipRule="evenodd" d="M15.9162 8.10676C16.1993 8.38596 16.2024 8.84184 15.9233 9.12496L10.2964 14.8308C10.0172 15.1139 9.56136 15.1171 9.27823 14.8379C8.9951 14.5587 8.99192 14.1028 9.27112 13.8197L14.8979 8.11386C15.1772 7.83073 15.633 7.82755 15.9162 8.10676Z" fill="white"/>
</svg>

              </button>
            </form>
          </div>

          <article className="try-card">
            <h3 className="try-card__title">Сдаются 1-комн. апартаменты, 45 м²</h3>
            <div className="try-card__location">
              <span className="try-card__pin" aria-hidden="true">
                <img src={rentIcon} alt="" />
              </span>
              <span>Адмиралтейская · 5 минут пешком</span>
            </div>
            <div className="try-card__price">120 000 ₽/мес</div>
            <p className="try-card__text">
              От года, комм. платежи включены (без счётчиков), без комиссии, залог
              120 000 ₽
            </p>
            <p className="try-card__text">
              Сдаётся дизайнерская однокомнатная квартира в самом центре
              Санкт‑Петербурга, в золотом треугольнике у стен Эрмитажа, на Гороховой
              улице в нескольких минутах пешком от Дворцовой площади и Невского
              проспекта...
            </p>
            <div className="try-card__gallery" aria-hidden="true">
              <img className="try-card__photo try-card__photo--main" src={photo1} alt="" />
              <div className="try-card__thumbs">
                <img className="try-card__photo try-card__photo--thumb" src={photo2} alt="" />
                <img className="try-card__photo try-card__photo--thumb" src={photo3} alt="" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
