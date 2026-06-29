exports.handler = async function(event) {
  if(event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
  if(!MISTRAL_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Clé API manquante' }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'JSON invalide' }) }; }

  const { images } = body; // array of base64 data URLs
  if(!images || !images.length) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Aucune image reçue' }) };
  }

  // Build message content: text prompt + all images
  const content = [
    {
      type: 'text',
      text: `Tu es un expert en déménagement. Analyse ces ${images.length} photo(s) de pièce(s) à déménager.

Réponds UNIQUEMENT en JSON valide, sans markdown, sans explication, exactement ce format :
{
  "meubles": [
    {"nom": "Canapé 3 places", "emoji": "🛋️", "quantite": 1, "volume_unitaire": 1.8},
    {"nom": "Table basse", "emoji": "🟫", "quantite": 1, "volume_unitaire": 0.3}
  ],
  "resume": "Appartement T2 bien meublé"
}

Règles STRICTES :
- Liste UNIQUEMENT les meubles et appareils électroménagers déplaçables
- Estime le volume_unitaire en m³ avec précision (nombre décimal)
- Utilise un emoji pertinent pour chaque meuble
- EXCLUSIONS ABSOLUES — ne jamais inclure : fenêtres, portes, murs, plafonds, sols, luminaires fixes au plafond, radiateurs, prises électriques, interrupteurs, éléments de construction
- Les volumes doivent être réalistes : canapé 3 places ~1.8m³, lit double ~1.4m³, armoire ~2m³, table ~0.9m³, chaise ~0.15m³
- volume_unitaire doit toujours être un nombre décimal valide (ex: 1.8), jamais null ou vide`
    },
    ...images.map(dataUrl => {
      const [meta, data] = dataUrl.split(',');
      const mimeType = meta.match(/:(.*?);/)[1];
      return {
        type: 'image_url',
        image_url: `data:${mimeType};base64,${data}`
      };
    })
  ];

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'pixtral-12b-2409',
        max_tokens: 1500,
        messages: [{ role: 'user', content }]
      })
    });

    const data = await response.json();

    if(!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.message || 'Erreur Mistral' })
      };
    }

    let raw = data.choices[0].message.content.trim();
    raw = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(parsed)
    };

  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur serveur : ' + err.message })
    };
  }
};
