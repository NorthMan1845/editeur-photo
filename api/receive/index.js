// ─── /api/receive ────────────────────────────────────────────────────────────
//
// POST  → Power Automate envoie l'image  { "image": "data:image/png;base64,..." }
// GET   → Le HTML récupère l'image en attente
//
// L'image est gardée en mémoire jusqu'à ce que le HTML la récupère.
// ─────────────────────────────────────────────────────────────────────────────

let pendingImage = null; // stockage temporaire en mémoire

module.exports = async function (context, req) {

  // ── Power Automate envoie l'image ─────────────────────────────────────────
  if (req.method === 'POST') {
    const body = req.body;

    if (!body || !body.image) {
      context.res = {
        status: 400,
        body: { error: 'Champ "image" manquant dans le body' }
      };
      return;
    }

    pendingImage = body.image;

    context.res = {
      status: 200,
      body: { message: 'Image reçue et en attente' }
    };
    return;
  }

  // ── Le HTML vérifie si une image est disponible ───────────────────────────
  if (req.method === 'GET') {
    if (!pendingImage) {
      context.res = {
        status: 200,
        body: { ready: false }
      };
      return;
    }

    const imageToSend = pendingImage;
    pendingImage = null; // vider après envoi

    context.res = {
      status: 200,
      body: { ready: true, image: imageToSend }
    };
    return;
  }

  context.res = { status: 405, body: { error: 'Méthode non autorisée' } };
};
