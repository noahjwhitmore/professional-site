export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    try {
        // Call the Resend API using native fetch
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'Contact Form <onboarding@resend.dev>',
                to: 'noahjwhitmore@gmail.com', // Must be your verified Resend email
                subject: `New Portfolio Message from ${name}`,
                html: `<p><strong>Name:</strong> ${name}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Message:</strong><br>${message}</p>`
            })
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            const errorData = await response.json();
            return res.status(500).json({ error: errorData.message });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}