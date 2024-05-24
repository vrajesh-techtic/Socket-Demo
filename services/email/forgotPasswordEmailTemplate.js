const emailTemplate = (token) => {
  const url =
    process.env.BACKEND_URL + `/api/user/forgot-password/${token}`;

  const html = `
    
    <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body style="padding: 20px;">
  <a
    href=${url}
    style="
      font-size: 1.2rem;
      background-color: rgb(47, 47, 240);
      color: white;
      padding: 8px 12px;
      text-decoration: none;
      border-radius: 10px;
      margin: 20px;
      
    "
    >Reset button</a
  >
</body>
</html>
    
    
    `;

  return html;
};

module.exports = emailTemplate;
