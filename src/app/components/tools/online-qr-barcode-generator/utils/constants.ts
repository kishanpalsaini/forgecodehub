export const QR_LIMITS = {
  DIRECT_UPLOAD: {
    maximum: 524288,
    recommended: 153600,
    warning: 102400,
  },
  CLOUD_STORAGE: {
    minimum: 524288,
  },
};

export const CLOUD_STORAGE_OPTIONS = [
  {
    name: "Google Drive",
    icon: "📁",
    steps: [
      "1. Upload your file to Google Drive",
      "2. Right-click → Share → Get link",
      "3. Set to 'Anyone with the link'",
      "4. Copy the share link",
      "5. Paste it in the URL field and generate QR code",
    ],
    maxSize: "15GB free",
    url: "https://drive.google.com",
  },
  {
    name: "Dropbox",
    icon: "📦",
    steps: [
      "1. Upload file to Dropbox",
      "2. Click 'Share' → Create link",
      "3. Copy the link",
      "4. Paste in URL field and generate",
    ],
    maxSize: "2GB free",
    url: "https://dropbox.com",
  },
  {
    name: "WeTransfer",
    icon: "📮",
    steps: [
      "1. Go to wetransfer.com",
      "2. Upload your file (no account needed)",
      "3. Get the download link",
      "4. Paste in URL field",
    ],
    maxSize: "2GB free",
    url: "https://wetransfer.com",
  },
  {
    name: "File.io",
    icon: "🔗",
    steps: [
      "1. Visit file.io",
      "2. Upload file (anonymous, no account)",
      "3. Copy the generated link",
      "4. Encode in QR code",
    ],
    maxSize: "Unlimited",
    url: "https://file.io",
  },
];