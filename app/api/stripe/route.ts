import { auth, currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'
import { stripe } from '@/lib/stripe'
import { absoluteUrl } from '@/lib/utils'

const settingsUrl = absoluteUrl('/settings')

// export async function GET() {
//   try {


//     const { userId } = auth()
//     const user = await currentUser()

//     if (!user || !userId) {
//       return new NextResponse('Unauthorized', { status: 401 })
//     }

//     const userSubscription = await prismadb.userSubscription.findUnique({
//       where: {
//         userId
//       }
//     })

//     if (userSubscription && userSubscription.stripeCustomerId) {
//       const stripeSession = await stripe.billingPortal.sessions.create({
//         customer: userSubscription.stripeCustomerId,
//         return_url: settingsUrl
//       })

//       return new NextResponse(JSON.stringify({ url: stripeSession.url }))
//     }

//     const stripeSession = await stripe.checkout.sessions.create({
//       success_url: settingsUrl,
//       cancel_url: settingsUrl,
//       payment_method_types: ['card'],
//       mode: 'subscription',
//       billing_address_collection: 'auto',
//       customer_email: user.emailAddresses[0].emailAddress,
//       line_items: [
//         {
//           price_data: {
//             currency: 'USD',
//             product_data: {
//               name: "Genius Pro",
//               description: 'Unlimited AI Generations'
//             },
//             unit_amount: 2000,
//             recurring: {
//               interval: 'week'
//             }
//           },
//           quantity: 1
//         }
//       ],
//       metadata: { userId }
//     })

//     return new NextResponse(JSON.stringify({ url: stripeSession.url }))

//   } catch (error) {
//     console.log('[STRIPE_ERROR]', error)

//     return new NextResponse('Internal error', { status: 500 })
//   }
// }



export async function GET() {
  try {
    const { userId } = auth();


    const user = await currentUser();



    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId
      }
    })



    console.log(userSubscription)
    // {
    //   id: '65f99434b199e598452cd90e',
    //   userId: 'user_2datmzRyeLCRx8a6NJPTPwaD4D2',
    //   stripeCustomerId: 'cus_PlZxNef7BRH2hS',
    //   stripeSubscriptionId: 'sub_1Ow2nLE6MdTwTuyLQ6sIpBkc',
    //   stripePriceId: 'price_1Ow2muE6MdTwTuyLFOKjUQdM',
    //   stripeCurrentPeriodEnd: 2024-04-19T13:33:35.000Z
    // }

  

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      })

      return new NextResponse(JSON.stringify({ url: stripeSession.url }))
    }



    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Genius Pro",
              description: "Unlimited AI Generations"
            },
            unit_amount: 2000,
            recurring: {
              interval: "month"
            }
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    })

    return new NextResponse(JSON.stringify({ url: stripeSession.url }))

    // return new NextResponse(JSON.stringify({ url: 'yessss' }))
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};