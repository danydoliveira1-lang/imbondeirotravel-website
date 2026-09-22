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
export async function POST(request) {
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

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "Please choose a file to upload." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type." },
        { status: 400 }
      );
    }

    const maximumSize = 10 * 1024 * 1024;

    if (file.size > maximumSize) {
      return NextResponse.json(
        { error: "The file must be smaller than 10 MB." },
        { status: 400 }
      );
    }

    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const fileName = `${Date.now()}-${safeName}`;
    const objectPath = `launch-v1/${fileName}`;
    const encodedPath = objectPath
      .split("/")
      .map(encodeURIComponent)
      .join("/");

    const uploadResponse = await fetch(
      `${url}/storage/v1/object/journey-media/${encodedPath}`,
      {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": file.type,
          "x-upsert": "false",
        },
        body: await file.arrayBuffer(),
      }
    );

    if (!uploadResponse.ok) {
      throw new Error(await uploadResponse.text());
    }

    const reference =
      `${url}/storage/v1/object/public/journey-media/${objectPath}`;

    return NextResponse.json({
      asset: {
        name: file.name,
        path: objectPath,
        reference,
        type: file.type.startsWith("video/") ? "video" : "image",
        source: "storage",
        metadata: {
          mimetype: file.type,
          size: file.size,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Upload failed." },
      { status: 500 }
    );
  }
}
