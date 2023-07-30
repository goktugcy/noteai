import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { transcribeAudio, uploadAudioFile, generateRandomString } from 'Helpers/app-helper'
import Env from '@ioc:Adonis/Core/Env'
import fs from 'fs'
import pdfkit from 'pdfkit'

export default class HomeController {
  public async index({ view }: HttpContextContract) {
    return view.render('home')
  }

  public async upload({ request, response }: HttpContextContract) {
    const audioFile = request.file('audioFile', {
      extnames: ['mp3', 'ogg', 'wav'],
      size: '10mb',
    }) as any

    const tempPath = audioFile.tmpPath
    const apiToken = Env.get('ASSEMBLY_API')

    const uploadUrl = (await uploadAudioFile(apiToken, tempPath)) as string

    const transcript = await transcribeAudio(apiToken, uploadUrl)

    const PDFDocument = pdfkit

    async function createPdf(transcriptText) {
      const randomString = generateRandomString()
      const pdfPath = 'public/uploads/' + randomString + '.pdf'

      const doc = new PDFDocument()
      const stream = fs.createWriteStream(pdfPath)

      doc.pipe(stream)
      doc.fontSize(12).text(transcriptText, 50, 50)
      doc.end()
      return pdfPath
    }

    const transcriptText = transcript.text
    const pdfPath = await createPdf(transcriptText)
    console.log('PDF created:', pdfPath)

    const pdfName = pdfPath.split('/').pop()
    return response.redirect('uploads/' + pdfName)
  }
}
