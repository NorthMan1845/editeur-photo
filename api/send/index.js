// ─── /api/send ───────────────────────────────────────────────────────────────
//
// POST  → Le HTML envoie l'image annotée  { "image": "data:image/png;base64,..." }
// GET   → Power Automate récupère l'image annotée
//
// L'image est gardée en mémoire jusqu'à ce que Power Automate la récupère.
// ─────────────────────────────────────────────────────────────────────────────

let annotatedImage = null; // stockage temporaire en mémoire

module.exports = async function (context, req) {

  // ── Le HTML envoie l'image annotée ───────────────────────────────────────
  if (req.method === 'POST') {
    const body = req.body;

    if (!body || !body.image) {
      context.res = {
        status: 400,
        body: { error: 'Champ "image" manquant dans le body' }
      };
      return;
    }

    annotatedImage = body.image;

    context.res = {
      status: 200,
      body: { message: 'Image annotée reçue et en attente' }
    };
    return;
  }

  // ── Power Automate récupère l'image annotée ───────────────────────────────
  if (req.method === 'GET') {
    if (!annotatedImage) {
      context.res = {
        status: 200,
        body: { ready: false }
      };
      return;
    }

    const imageToSend = annotatedImage;
    annotatedImage = null; // vider après envoi

    context.res = {
      status: 200,
      body: { ready: true, image: imageToSend }
    };
    return;
  }

  context.res = { status: 405, body: { error: 'Méthode non autorisée' } };
};
