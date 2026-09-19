"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

export default function BrandAssets({
  company = {},
  reload,
  flash,
}) {
  const [editing, setEditing] =
    useState(false);
  const [saving, setSaving] =
    useState(false);
  const [uploading, setUploading] =
    useState(false);
  const [loadingAssets, setLoadingAssets] =
    useState(false);
  const [error, setError] =
    useState("");
  const [assets, setAssets] =
    useState([]);
  const [form, setForm] =
    useState({
      website_logo_url:
        company.website_logo_url || "",
      document_logo_url:
        company.document_logo_url || "",
    });

  useEffect(() => {
    if (editing) return;

    setForm({
      website_logo_url:
        company.website_logo_url || "",
      document_logo_url:
        company.document_logo_url || "",
    });
  }, [
    company.website_logo_url,
    company.document_logo_url,
    editing,
  ]);

  useEffect(() => {
    const controller =
      new AbortController();

    async function loadAssets() {
      setLoadingAssets(true);

      try {
        const response = await fetch(
          "/api/admin/media-assets",
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            "Brand assets could not be loaded."
          );
        }

        const payload =
          await response.json();

        setAssets(payload.assets || []);
      } catch (loadError) {
        if (
          loadError.name !== "AbortError"
        ) {
          setError(
            loadError.message ||
              "Brand assets could not be loaded."
          );
        }
      } finally {
        setLoadingAssets(false);
      }
    }

    loadAssets();

    return () => controller.abort();
  }, []);

  const imageAssets = useMemo(
    () =>
      assets.filter(
        asset =>
          asset.type === "image"
      ),
    [assets]
  );

  const documentPreview =
    form.document_logo_url ||
    form.website_logo_url;

  async function uploadLogo(event) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData =
        new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/admin/media-assets",
        {
          method: "POST",
          body: formData,
        }
      );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Logo upload failed."
        );
      }

      const asset = payload.asset;

      if (asset.type !== "image") {
        throw new Error(
          "The selected brand asset must be an image."
        );
      }

      setAssets(current => [
        asset,
        ...current.filter(
          item =>
            item.reference !==
            asset.reference
        ),
      ]);

      flash(
        "Logo uploaded. Choose where it should be used, then save."
      );
    } catch (uploadError) {
      setError(
        uploadError.message ||
          "Logo upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveBrandAssets(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/settings",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            website_logo_url:
              form.website_logo_url ||
              null,
            document_logo_url:
              form.document_logo_url ||
              null,
          }),
        }
      );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Brand assets could not be saved."
        );
      }

      await reload();
      setEditing(false);

      flash(
        "Website and document logos updated."
      );
    } catch (saveError) {
      setError(
        saveError.message ||
          "Brand assets could not be saved."
      );
    } finally {
      setSaving(false);
    }
  }

  function cancelEditing() {
    setForm({
      website_logo_url:
        company.website_logo_url || "",
      document_logo_url:
        company.document_logo_url || "",
    });

    setError("");
    setEditing(false);
  }

  return (
    <section className="cc-panel cc-brand-assets">
      <div className="cc-panel-head">
        <div>
          <span className="cc-eyebrow">
            Brand identity
          </span>

          <h3>Website &amp; Document Logos</h3>
        </div>

        <div className="cc-row-actions">
          {!editing ? (
            <button
              type="button"
              onClick={() =>
                setEditing(true)
              }
            >
              Manage Brand Assets
            </button>
          ) : (
            <button
              type="button"
              onClick={cancelEditing}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <p>
        Control the official logos used across
        the public website and generated travel
        documents.
      </p>

      {editing && (
        <label className="cc-brand-upload">
          <span>Upload New Logo</span>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={uploading}
            onChange={uploadLogo}
          />

          <small>
            Transparent PNG or WebP is
            recommended.
          </small>

          {uploading && (
            <strong>
              Uploading logo…
            </strong>
          )}
        </label>
      )}

      {error && (
        <div
          className="cc-report-period-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="cc-brand-assets-grid">
        <article>
          <span className="cc-eyebrow">
            Public website
          </span>

          <h4>Website Logo</h4>

          <div className="cc-logo-preview">
            {form.website_logo_url ? (
              <img
                src={form.website_logo_url}
                alt="Website logo preview"
              />
            ) : (
              <span>
                Current built-in website logo
              </span>
            )}
          </div>

          {editing ? (
            <select
              value={
                imageAssets.find(
                  asset =>
                    asset.reference ===
                    form.website_logo_url
                )?.path || ""
              }
              disabled={
                loadingAssets ||
                uploading
              }
              onChange={event => {
                const asset =
                  imageAssets.find(
                    item =>
                      item.path ===
                      event.target.value
                  );

                setForm(current => ({
                  ...current,
                  website_logo_url:
                    asset?.reference || "",
                }));
              }}
            >
              <option value="">
                {loadingAssets
                  ? "Loading images..."
                  : "Use built-in website logo"}
              </option>

              {imageAssets.map(asset => (
                <option
                  key={asset.path}
                  value={asset.path}
                >
                  {asset.name}
                </option>
              ))}
            </select>
          ) : (
            <small>
              {company.website_logo_url
                ? "Managed from the Command Centre"
                : "Using the built-in website logo"}
            </small>
          )}
        </article>

        <article>
          <span className="cc-eyebrow">
            Reports &amp; travel documents
          </span>

          <h4>Document Logo</h4>

          <div className="cc-logo-preview document">
            {documentPreview ? (
              <img
                src={documentPreview}
                alt="Document logo preview"
              />
            ) : (
              <span>
                Current built-in document logo
              </span>
            )}
          </div>

          {editing ? (
            <select
              value={
                imageAssets.find(
                  asset =>
                    asset.reference ===
                    form.document_logo_url
                )?.path || ""
              }
              disabled={
                loadingAssets ||
                uploading
              }
              onChange={event => {
                const asset =
                  imageAssets.find(
                    item =>
                      item.path ===
                      event.target.value
                  );

                setForm(current => ({
                  ...current,
                  document_logo_url:
                    asset?.reference || "",
                }));
              }}
            >
              <option value="">
                {loadingAssets
                  ? "Loading images..."
                  : "Use website logo automatically"}
              </option>

              {imageAssets.map(asset => (
                <option
                  key={asset.path}
                  value={asset.path}
                >
                  {asset.name}
                </option>
              ))}
            </select>
          ) : (
            <small>
              {company.document_logo_url
                ? "Dedicated document logo selected"
                : company.website_logo_url
                  ? "Using the website logo automatically"
                  : "Using the built-in document logo"}
            </small>
          )}
        </article>
      </div>

      <div className="cc-brand-scope">
        <strong>
          Document logo coverage
        </strong>

        <span>
          Reports · Quotes · Pro-forma invoices ·
          Tax invoices · Itineraries · Operations
          run sheets · Future travel vouchers
        </span>
      </div>

      {editing && (
        <div className="cc-row-actions">
          <button
            type="button"
            className="cc-primary"
            disabled={
              saving ||
              uploading ||
              loadingAssets
            }
            onClick={saveBrandAssets}
          >
            {saving
              ? "Saving..."
              : "Save Brand Assets"}
          </button>
        </div>
      )}
    </section>
  );
}
