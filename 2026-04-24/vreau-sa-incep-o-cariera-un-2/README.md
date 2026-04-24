# TikTok Kebab

Site static de prezentare pentru TikTok Kebab, pregatit pentru publicare pe Vercel.

## Test local

Deschide `index.html` direct in browser sau ruleaza un server local:

```powershell
python -m http.server 8080
```

Apoi acceseaza `http://localhost:8080`.

## Admin demo

Pagina `admin.html` are login demo:

```text
Utilizator: Megaadmin
Parola: Megaadmin!
```

Important: acest admin este doar prototip static si salveaza datele in browser cu `localStorage`. Pentru clienti reali trebuie backend, baza de date, parole criptate si upload securizat.

## Deploy pe Vercel

1. Creeaza un repository GitHub cu aceste fisiere.
2. Intra pe https://vercel.com si conecteaza GitHub.
3. Alege proiectul si apasa Deploy.
4. Framework Preset: `Other`.
5. Build Command: lasa gol.
6. Output Directory: lasa gol sau `.`.

Dupa deploy, schimba in `robots.txt` si `sitemap.xml` domeniul `https://example.com/` cu domeniul real.
