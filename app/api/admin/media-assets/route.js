import { NextResponse } from "next/server";
import { isAuthenticated } from "../../../../lib/commandCentreAuth";
import fs from "node:fs/promises";
import path from "node:path";

const MEDIA_EXTENSIONS =
  /\.(jpg|jpeg|png|webp|gif|avif|svg|mp4|webm|mov|m4v)$/i;

function mediaType(reference = "", metadata = null, explicitType = "") {
  const type = String(explicitType || "").toLowerCase();

  if (type === "image" || type === "video" || type === "youtube") {
    return type;
  }

  if (metadata?.mimetype?.startsWith("image/")) return "image";
  if (metadata?.mimetype?.startsWith("video/")) return "video";

  if (/\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(reference)) {
    return "image";
  }

  if (/\.(mp4|webm|mov|m4v)$/i.test(reference)) {
    return "video";
  }

  if (/youtube\.com|youtu\.be/i.test(reference)) {
    return "youtube";
  }

  return "other";
}

async function readLocalAssets() {
  const root = path.join(process.cwd(), "public", "assets");

  async function walk(directory, relative = "") {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const results = [];

    for (const entry of entries) {
      const relativePath = relative
        ? `${relative}/${entry.name}`
        : entry.name;

      if (entry.isDirectory()) {
        results.push(
          ...(await walk(path.join(directory, entry.name), relativePath))
        );
      } else if (MEDIA_EXTENSIONS.test(entry.name)) {
        const reference = `/assets/${relativePath}`;

        results.push({
          name: entry.name,
          path: reference,
          reference,
          type: mediaType(reference),
          source: "website",
          metadata: null,
        });
      }
    }

    return results;
  }

  try {
    return await walk(root);
  } catch {
    return [];
  }
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: "Unauthorised" },
      { status: 401 }
    );
  }

  try {
    const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error("Supabase is not configured.");
    }

    const [storageResponse, mediaResponse, localAssets] =
      await Promise.all([
        fetch(`${url}/storage/v1/object/list/journey-media`, {
          method: "POST",
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prefix: "launch-v1",
            limit: 200,
            offset: 0,
            sortBy: {
              column: "name",
              order: "asc",
            },
          }),
          cache: "no-store",
        }),

        fetch(
          `${url}/rest/v1/media?select=*&status=eq.Active&order=name.asc`,
          {
            headers: {
              apikey: key,
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        ),

        readLocalAssets(),
      ]);

    if (!storageResponse.ok) {
      throw new Error(await storageResponse.text());
    }

    if (!mediaResponse.ok) {
      throw new Error(await mediaResponse.text());
    }

    const storageFiles = await storageResponse.json();
    const managedMedia = await mediaResponse.json();

    const storageAssets = storageFiles
      .filter(file => file.name)
      .map(file => {
        const reference =
          `${url}/storage/v1/object/public/journey-media/launch-v1/${file.name}`;

        return {
          name: file.name,
          path: `launch-v1/${file.name}`,
          reference,
          type: mediaType(reference, file.metadata),
          source: "storage",
          metadata: file.metadata || null,
        };
      });

    const managedAssets = managedMedia
      .filter(item => item.reference)
      .map(item => ({
        name: item.name || item.reference.split("/").pop(),
        path: item.reference,
        reference: item.reference,
        type: mediaType(
          item.reference,
          null,
          item.type
        ),
        source: "media-library",
        content_key: item.content_key || "",
        usage: item.usage || "",
        metadata: null,
      }));

    const combined = [
      ...managedAssets,
      ...storageAssets,
      ...localAssets,
    ];

    const seen = new Set();

    const assets = combined.filter(asset => {
      if (!asset.reference || seen.has(asset.reference)) {
        return false;
      }

      seen.add(asset.reference);
      return true;
    });

    return NextResponse.json(
      { assets },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        assets: [],
        error: error.message,
      },
      { status: 500 }
    );
  }
}
