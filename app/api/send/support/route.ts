import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { emailFormat } = await request.json();
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: `${emailFormat.receiver}`,
      subject: 'Technical Support',
      html: `Name: ${emailFormat.name}<br/><br/>Issue: ${emailFormat.description}`
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
