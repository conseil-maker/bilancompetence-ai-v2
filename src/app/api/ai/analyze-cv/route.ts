import { NextRequest, NextResponse } from 'next/server'
import { analyzeCV, extractCVText } from '@/services/ai/cv-analyzer'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('cv') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No CV file provided' },
        { status: 400 }
      )
    }

    // Extraire le texte du CV
    const cvText = await extractCVText(file)

    // Analyser avec l'IA
    const analysis = await analyzeCV(cvText)

    return NextResponse.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    console.error('Error in CV analysis API:', error)
    return NextResponse.json(
      { error: 'Failed to analyze CV' },
      { status: 500 }
    )
  }
}

