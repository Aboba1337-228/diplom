import { } from "dotenv/config"
import nodemailer from 'nodemailer'

const EMAIL_HOST = process.env.EMAIL_HOST
const EMAIL_HOST_PASSWORD = process.env.EMAIL_HOST_PASSWORD
const EMAIL_HOST_USER = process.env.EMAIL_HOST_USER
const EMAIL_PORT = process.env.EMAIL_PORT

class Mail {
  #transporter = null

  constructor() {
    this.#transporter = this.#getTransporter()
  }

  #getTransporter() {
    return nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 587,
      secure: false,
      auth: {
        user: 'museeva.di@yandex.ru',
        pass: 'taicedbxcopgjtah'
      }      
    })
  }

  async send(reciever, message) {
    try {
      const info = await this.#transporter.sendMail({
        from: 'qwe@mail.com',
        to: reciever,
        subject: 'Welcome to Test site',
        text: message,
        html: `<b>${message}</b>`
      })
      return info.messageId
    } catch(e) {
      return e
    }
  }

}

export default new Mail()