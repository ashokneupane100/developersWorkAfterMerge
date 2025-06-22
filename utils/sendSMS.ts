const sendSMS = async ({ to, message }: { to: string; message: string }) => {
  const res = await fetch("https://api.sparrowsms.com/v2/sms/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      token: process.env.SPARROW_API_TOKEN!,
      from: "Online Home .com.np",
      to,
      text: message,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error("SMS failed: " + errText);
  }
};

export default sendSMS;
