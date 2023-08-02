import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { uploadAudioFileToOpenAI } from 'Helpers/app-helper'

import Env from '@ioc:Adonis/Core/Env'
// import fs from 'fs'
// import pdfkit from 'pdfkit'

export default class HomeController {
  public async index({ view }: HttpContextContract) {
    return view.render('home')
  }

  public async uploadOpenAI({ request, response }: HttpContextContract) {
    try {
      const apiToken = Env.get('OPENAI_API')
      const model = 'whisper-1'
      const audioFile = request.file('audioFile', {
        extnames: ['mp3', 'ogg', 'wav'],
        size: '10mb',
      }) as any

      if (!apiToken) {
        throw new Error('OpenAI API anahtarı bulunamadı.')
      } else if (!model) {
        throw new Error('OpenAI modeli bulunamadı.')
      } else if (!audioFile) {
        throw new Error('Dosya bulunamadı.')
      }

      const tempPath = audioFile.tmpPath

      const result = await uploadAudioFileToOpenAI(apiToken, tempPath, model)

      console.log('Transcription Result:', result)

      return response.ok(result)
    } catch (error) {
      console.error(error)
      return response.internalServerError('An error occurred while processing the audio file.')
    }
  }
}
