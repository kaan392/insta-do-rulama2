const { Client } = require('pg');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);
  const { username, password } = data;

  if (!username || !password) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Eksik kullanıcı bilgisi' }) };
  }

  // PostgreSQL bağlantı bilgilerini Netlify ortam değişkenlerinden al
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();

    // Şifreyi hashlemeyi ileride ekleyebilirsin, şimdi direkt kaydediyoruz
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    await client.query(query, [username, password]);

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Kullanıcı kaydedildi' }),
    };
  } catch (error) {
    await client.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Veritabanı hatası' }),
    };
  }
};
