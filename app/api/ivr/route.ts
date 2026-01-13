import { NextRequest, NextResponse } from 'next/server'

// POST - Handle IVR call (simulating Twilio/Exotel response)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { CallSid, From, To, CallStatus, Digits } = body

    // Simulate IVR menu system
    let response = ''

    if (!Digits) {
      // Initial greeting
      response = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        Welcome to EmpowerHer. Press 1 for Girls programs. Press 2 for Women programs. 
        Press 3 for Scheme information. Press 4 to speak with a representative.
    </Say>
    <Gather numDigits="1" timeout="10" action="/api/ivr" method="POST">
        <Pause length="5"/>
    </Gather>
    <Say voice="alice" language="en-IN">
        We did not receive your selection. Goodbye.
    </Say>
</Response>`
    } else {
      // Handle menu selections
      switch (Digits) {
        case '1':
          response = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        Thank you for selecting Girls programs. Our programs include scholarships, 
        educational courses, and mentorship. Press 1 to register. Press 2 to hear more. 
        Press 9 to go back.
    </Say>
    <Gather numDigits="1" timeout="10" action="/api/ivr" method="POST">
        <Pause length="5"/>
    </Gather>
    <Say voice="alice" language="en-IN">
        Thank you for calling EmpowerHer. Goodbye.
    </Say>
</Response>`
          break
        case '2':
          response = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        Thank you for selecting Women programs. We offer business tools, 
        micro-finance guidance, and skill development workshops. Press 1 to register. 
        Press 2 to hear more. Press 9 to go back.
    </Say>
    <Gather numDigits="1" timeout="10" action="/api/ivr" method="POST">
        <Pause length="5"/>
    </Gather>
    <Say voice="alice" language="en-IN">
        Thank you for calling EmpowerHer. Goodbye.
    </Say>
</Response>`
          break
        case '3':
          response = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        We offer multiple schemes including Beti Bachao Beti Padhao, Sukanya Samriddhi Yojana, 
        and many more. Visit our website or press 1 to receive scheme information via SMS.
    </Say>
    <Gather numDigits="1" timeout="10" action="/api/ivr" method="POST">
        <Pause length="5"/>
    </Gather>
    <Say voice="alice" language="en-IN">
        Thank you for calling EmpowerHer. Goodbye.
    </Say>
</Response>`
          break
        case '4':
          response = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        Please hold while we connect you to a representative. Our team will assist you shortly.
    </Say>
    <Dial timeout="30">+919876543210</Dial>
    <Say voice="alice" language="en-IN">
        The call could not be completed. Please try again later or visit our website.
    </Say>
</Response>`
          break
        case '9':
          response = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Redirect>/api/ivr</Redirect>
</Response>`
          break
        default:
          response = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        Invalid selection. Please try again.
    </Say>
    <Redirect>/api/ivr</Redirect>
</Response>`
      }
    }

    return new NextResponse(response, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error('Error handling IVR:', error)
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        An error occurred. Please try again later.
    </Say>
</Response>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'application/xml',
        },
      }
    )
  }
}

// GET - Get IVR information
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      ivrNumber: '+91 9876543210',
      integration: 'Twilio/Exotel compatible',
      features: [
        'Multi-level IVR menu',
        'Call routing',
        'SMS notifications',
        'Call recording support',
      ],
      note: 'This is a mock IVR endpoint. In production, integrate with Twilio or Exotel for actual call handling.',
    },
  })
}


