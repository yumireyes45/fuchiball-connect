export function getSiteUrl(): string {
    // 1) Producción o override manual
    const prod = import.meta.env.VITE_PUBLIC_SITE_URL;
    if (prod) return prod.endsWith("/") ? prod : prod + "/";
  
    // 2) Preview en Vercel
    const preview = import.meta.env.VERCEL_URL;
    if (preview) {
      const url = preview.startsWith("http")
        ? preview
        : `https://${preview}`;
      return url.endsWith("/") ? url + "/" : url + "/";
    }
  
    // 3) Fallback local 
    return "http://localhost:8080/";
  }