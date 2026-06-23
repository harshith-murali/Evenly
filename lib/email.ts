type InviteEmail = {
  email: string;
  groupName: string;
  token: string;
};

export async function sendInvitationEmail({ email, groupName, token }: InviteEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

  if (!apiKey) {
    return;
  }

  const inviteUrl = `${appBaseUrl}/invite/${token}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Evenly <onboarding@resend.dev>",
      html: `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5;">
          <h1>You were invited to ${groupName}</h1>
          <p>Join the group on Evenly to split expenses and settle up.</p>
          <p><a href="${inviteUrl}" style="background:#171717;color:#fff;padding:12px 18px;border-radius:999px;text-decoration:none;">Open invite</a></p>
          <p style="color:#6f685f;font-size:13px;">${inviteUrl}</p>
        </div>
      `,
      subject: `Join ${groupName} on Evenly`,
      to: email
    })
  }).catch((error) => {
    console.error("Resend invitation request failed", error);
    return null;
  });

  if (!response) return;

  if (!response.ok) {
    const message = await response.text();
    console.error("Resend invitation failed", message);
  }
}
