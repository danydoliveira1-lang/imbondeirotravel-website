# Secure Email Setup

The website sends inquiry and request emails through the server endpoint:

`/api/send-request`

Set these environment variables on the hosting platform:

```text
RESEND_API_KEY=your_resend_api_key
IMBONDEIRO_TO_EMAIL=imbondeirotravel@gmail.com
IMBONDEIRO_FROM_EMAIL=Imbondeiro Travel <requests@your-verified-domain.com>
```

`IMBONDEIRO_FROM_EMAIL` must use a sender/domain verified with your email provider.

If the endpoint is not configured yet, the website falls back to opening the visitor's email app with the request prepared.
