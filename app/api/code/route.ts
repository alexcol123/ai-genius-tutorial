import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { incrementApiLimit, checkApiLimit } from '@/lib/api-limit'
import { checkSubscription } from "@/lib/subscription";


export const maxDuration = 100 // This function can run for a maximum of 300 seconds

const openai = new OpenAI();

const instructionMessage: ChatCompletionMessageParam = {
  role: "system",
  content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
};

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { messages } = body

    if (!userId) {
      return new NextResponse('Unautorized', { status: 401 })
    }

    if (!messages) {
      return new NextResponse('Messages are required', { status: 400 })
    }

    const freeTrial = await checkApiLimit()
    const isPro = await checkSubscription()

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 })

    }



    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 })

    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [instructionMessage, ...messages]

    });

    if (!isPro) {
      await incrementApiLimit()
    }

    console.log(response)

    return NextResponse.json(response.choices[0].message)

  } catch (error) {
    console.log('[CODE_ERROR]', error)
    return new NextResponse("Internal Error", { status: 500 })
  }

}