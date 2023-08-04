import fs from 'fs/promises'
import axios from 'axios'
import FormData from 'form-data'

function generateRandomString() {
  const randomString = Math.random().toString(36).substring(2, 15)
  return randomString
}

async function uploadAudioFileToOpenAI(token: string, filePath: string, model: string) {
  try {
    const formData = new FormData()
    formData.append('file', await fs.readFile(filePath))
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
