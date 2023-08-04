import fs from 'fs/promises'
import axios from 'axios'
import FormData from 'form-data'
import { v4 as uuidv4 } from 'uuid'

function generateRandomString() {
  const randomString = Math.random().toString(36).substring(2, 15)
  return randomString
}

async function uploadAudioFileToOpenAI(token: string, filePath: string, model: string) {
  try {
    const formData = new FormData()
    const uniqueFilename = `${uuidv4()}.mp3`
    formData.append('file', await fs.readFile(filePath), uniqueFilename)
    formData.append('model', model)

    const headers = {
      Authorization: `Bearer ${token}`,
      ...formData.getHeaders(),
    }

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers,
    })

    console.log('OpenAI API Response:', response.data) // Log the API response

    return response.data
  } catch (error) {
    throw new Error('Failed to upload the audio file to OpenAI API.')
  }
}

export { generateRandomString, uploadAudioFileToOpenAI }
