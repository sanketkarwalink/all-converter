const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://all-converter.vercel.app";

export const SITE = {
  name: "All Converter",
  tagline: "Free Online Converter Tools - All in One",
  description:
    "Free all-in-one online converter tools. Convert Markdown to PDF, images, JSON to CSV, and more. No upload required, 100% client-side processing.",
  url: BASE_URL,
};

export type Category = "document" | "image" | "data" | "developer";

export interface ConverterInfo {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  metaDescription: string;
  category: Category;
  icon: string;
}

export const converters: ConverterInfo[] = [
  {
    slug: "md-to-pdf",
    title: "Markdown to PDF Converter",
    shortTitle: "MD to PDF",
    description: "Convert Markdown documents to PDF files",
    metaDescription:
      "Free online Markdown to PDF converter. Convert your MD files to professional PDF documents instantly. No upload needed, works in your browser.",
    category: "document",
    icon: "📄",
  },
  {
    slug: "image-converter",
    title: "Image Format Converter",
    shortTitle: "Image Converter",
    description: "Convert images between PNG, JPG, WebP, and more",
    metaDescription:
      "Free online image converter. Convert PNG, JPG, WebP, GIF, and BMP images instantly. No upload required, 100% private client-side processing.",
    category: "image",
    icon: "🖼️",
  },
  {
    slug: "json-to-csv",
    title: "JSON to CSV Converter",
    shortTitle: "JSON to CSV",
    description: "Convert JSON data to CSV format",
    metaDescription:
      "Free online JSON to CSV converter. Transform your JSON arrays into CSV spreadsheets instantly. No server upload, all processing in your browser.",
    category: "data",
    icon: "🔀",
  },
  {
    slug: "csv-to-json",
    title: "CSV to JSON Converter",
    shortTitle: "CSV to JSON",
    description: "Convert CSV data to JSON format",
    metaDescription:
      "Free online CSV to JSON converter. Transform CSV files into JSON arrays instantly. Client-side processing keeps your data private.",
    category: "data",
    icon: "🔁",
  },
  {
    slug: "json-to-yaml",
    title: "JSON to YAML Converter",
    shortTitle: "JSON to YAML",
    description: "Convert JSON data to YAML format",
    metaDescription:
      "Free online JSON to YAML converter. Convert your JSON configuration to YAML format instantly. No data leaves your browser.",
    category: "data",
    icon: "📋",
  },
  {
    slug: "yaml-to-json",
    title: "YAML to JSON Converter",
    shortTitle: "YAML to JSON",
    description: "Convert YAML data to JSON format",
    metaDescription:
      "Free online YAML to JSON converter. Transform YAML configuration files to JSON format instantly. All processing done client-side.",
    category: "data",
    icon: "📝",
  },
  {
    slug: "json-to-xml",
    title: "JSON to XML Converter",
    shortTitle: "JSON to XML",
    description: "Convert JSON data to XML format",
    metaDescription:
      "Free online JSON to XML converter. Convert your JSON data structures to XML format instantly. 100% private client-side conversion.",
    category: "data",
    icon: "🔣",
  },
  {
    slug: "base64-tool",
    title: "Base64 Encode Decode",
    shortTitle: "Base64 Tool",
    description: "Encode or decode Base64 strings and files",
    metaDescription:
      "Free online Base64 encoder and decoder. Encode text or files to Base64, or decode Base64 back to text. Instant client-side processing.",
    category: "developer",
    icon: "🔐",
  },
  {
    slug: "url-encode",
    title: "URL Encode Decode",
    shortTitle: "URL Encoder",
    description: "Encode or decode URL strings",
    metaDescription:
      "Free online URL encoder and decoder. Encode or decode URLs and query parameters instantly. Client-side tool with no data upload.",
    category: "developer",
    icon: "🌐",
  },
  {
    slug: "html-minifier",
    title: "HTML Minifier",
    shortTitle: "HTML Minifier",
    description: "Minify HTML code to reduce file size",
    metaDescription:
      "Free online HTML minifier. Compress your HTML code by removing whitespace and comments. Reduce page load times with instant client-side minification.",
    category: "developer",
    icon: "⚡",
  },
  {
    slug: "css-minifier",
    title: "CSS Minifier",
    shortTitle: "CSS Minifier",
    description: "Minify CSS code to reduce file size",
    metaDescription:
      "Free online CSS minifier. Compress your CSS stylesheets by removing whitespace and comments. Client-side processing for instant results.",
    category: "developer",
    icon: "🎨",
  },
  {
    slug: "js-minifier",
    title: "JavaScript Minifier",
    shortTitle: "JS Minifier",
    description: "Minify JavaScript code for production",
    metaDescription:
      "Free online JavaScript minifier. Compress your JS code by removing whitespace and comments. Reduce bundle sizes instantly in your browser.",
    category: "developer",
    icon: "📦",
  },
  {
    slug: "docx-to-pdf",
    title: "DOCX to PDF Converter",
    shortTitle: "DOCX to PDF",
    description: "Convert Word documents to PDF files",
    metaDescription:
      "Free online DOCX to PDF converter. Convert your Word documents to PDF format instantly. No upload needed, 100% client-side processing.",
    category: "document",
    icon: "📝",
  },
  {
    slug: "pdf-to-docx",
    title: "PDF to DOCX Converter",
    shortTitle: "PDF to DOCX",
    description: "Convert PDF files to editable Word documents",
    metaDescription:
      "Free online PDF to DOCX converter. Turn your PDF files into editable Word documents. Client-side conversion keeps your data private.",
    category: "document",
    icon: "📄",
  },
  {
    slug: "jpg-to-pdf",
    title: "JPG to PDF Converter",
    shortTitle: "JPG to PDF",
    description: "Convert JPG images to PDF files",
    metaDescription:
      "Free online JPG to PDF converter. Turn your images into PDF documents instantly. No upload needed, 100% client-side processing.",
    category: "document",
    icon: "🖼️",
  },
  {
    slug: "pdf-to-jpg",
    title: "PDF to JPG Converter",
    shortTitle: "PDF to JPG",
    description: "Convert PDF pages to JPG images",
    metaDescription:
      "Free online PDF to JPG converter. Extract pages from PDF as high-quality images. Client-side processing keeps your files private.",
    category: "document",
    icon: "🖼️",
  },
  {
    slug: "merge-pdf",
    title: "Merge PDF Files",
    shortTitle: "Merge PDF",
    description: "Combine multiple PDF files into one document",
    metaDescription:
      "Free online PDF merger. Combine multiple PDF files into a single document. No upload needed, all processing happens in your browser.",
    category: "document",
    icon: "📑",
  },
  {
    slug: "split-pdf",
    title: "Split PDF Files",
    shortTitle: "Split PDF",
    description: "Split PDF into separate files by pages",
    metaDescription:
      "Free online PDF splitter. Extract specific pages from a PDF into a new file. Client-side processing keeps your data private.",
    category: "document",
    icon: "✂️",
  },
  {
    slug: "compress-pdf",
    title: "Compress PDF",
    shortTitle: "Compress PDF",
    description: "Reduce PDF file size while keeping quality",
    metaDescription:
      "Free online PDF compressor. Reduce PDF file size for easier sharing. All processing happens in your browser with no upload needed.",
    category: "document",
    icon: "📦",
  },
  {
    slug: "rotate-pdf",
    title: "Rotate PDF Pages",
    shortTitle: "Rotate PDF",
    description: "Rotate pages in your PDF document",
    metaDescription:
      "Free online PDF rotator. Rotate pages in your PDF document to the correct orientation. 100% client-side processing.",
    category: "document",
    icon: "🔄",
  },
];

export const categories: Record<Category, { label: string }> = {
  document: { label: "Document Converters" },
  image: { label: "Image Converters" },
  data: { label: "Data Converters" },
  developer: { label: "Developer Tools" },
};

export function getConverter(slug: string): ConverterInfo | undefined {
  return converters.find((c) => c.slug === slug);
}
