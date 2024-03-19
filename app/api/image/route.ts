import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { incrementApiLimit, checkApiLimit } from '@/lib/api-limit'
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { prompt, amount = 2, resolution = '1024x1024' } = body

    if (!userId) {
      return new NextResponse('Unautorized', { status: 401 })
    }

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 })
    }

    if (!amount) {
      return new NextResponse('amount is required', { status: 400 })
    }


    if (!resolution) {
      return new NextResponse('resolution is required', { status: 400 })
    }

    const freeTrial = await checkApiLimit()
    const isPro = await checkSubscription()

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 })

    }


    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: parseInt(amount),
      size: resolution,
      style: 'natural'   //  choose 'vivid' or 'natural'
    })

    if (!isPro) {
      await incrementApiLimit()
    }



    return NextResponse.json(response.data[0].url)

  } catch (error) {
    console.log('[IMAGE_ERROR]', error)
    return new NextResponse("Internal Error", { status: 500 })
  }

}