import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

export function ImageDropzone({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const { lang } = useLang();
  const es = lang !== "en";
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(es ? "El archivo debe ser una imagen" : "File must be an image");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError(es ? "Máximo 10 MB" : "Max 10 MB");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("decoration-images")
        .upload(path, file, { contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("decoration-images").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e) {
      setError((e as Error)?.message ?? "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className="text-sm font-semibold">{es ? "Imagen" : "Image"}</label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          upload(e.dataTransfer.files?.[0]);
        }}
        className={`mt-1 flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed p-4 transition-colors ${
          drag ? "border-primary bg-primary/10" : "border-input bg-background hover:border-primary"
        }`}
      >
        {value ? (
          <img src={value} alt="" className="h-24 w-24 rounded-lg object-cover" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-muted text-3xl">🖼️</div>
        )}
        <div className="text-sm">
          <p className="font-semibold">
            {busy
              ? es ? "Subiendo..." : "Uploading..."
              : es ? "Arrastra una imagen aquí o haz clic para elegir" : "Drag an image here or click to browse"}
          </p>
          <p className="text-muted-foreground">JPG, PNG, WEBP · 10 MB</p>
          {value && !busy && (
            <p className="mt-1 text-primary">{es ? "Clic para reemplazar" : "Click to replace"}</p>
          )}
          {error && <p className="mt-1 text-destructive">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          upload(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
