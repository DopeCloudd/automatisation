import fs from "fs";
import path from "path";

const tokenFilePath = path.resolve(process.cwd(), "zoom_token.json");

const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID!;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;

interface TokenData {
  access_token: string;
  expires_in: number;
  expires_at: number;
}

function readToken(): TokenData | null {
  if (fs.existsSync(tokenFilePath)) {
    const raw = fs.readFileSync(tokenFilePath, "utf-8");
    if (!raw.trim()) {
      // Fichier vide => on le supprime
      fs.unlinkSync(tokenFilePath);
      return null;
    }
    return JSON.parse(raw) as TokenData;
  }
  return null;
}

function storeToken(tokenData: TokenData) {
  fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData, null, 2));
}

async function generateToken(): Promise<string> {
  const response = await fetch("https://zoom.us/oauth/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "account_credentials",
      account_id: ZOOM_ACCOUNT_ID,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur génération token Zoom : ${errorText}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  const tokenData: TokenData = {
    access_token: data.access_token,
    expires_in: data.expires_in,
    expires_at: Date.now() + data.expires_in * 1000 - 60 * 1000, // expire 1 min avant
  };

  storeToken(tokenData);
  return tokenData.access_token;
}

export async function getZoomToken(): Promise<string> {
  const token = readToken();

  if (token && Date.now() < token.expires_at) {
    return token.access_token;
  }

  return await generateToken();
}
