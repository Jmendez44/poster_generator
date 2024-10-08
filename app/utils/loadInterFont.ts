// utils/loadInterFont.ts

export async function loadInterFont() {
  const inter = new FontFace(
    "Inter",
    'url(/fonts/Inter-Regular.woff2) format("woff2")',
    {
      style: "normal",
      weight: "400",
    }
  );

  const interBold = new FontFace(
    "Inter",
    'url(/fonts/Inter-Bold.woff2) format("woff2")',
    {
      style: "normal",
      weight: "700",
    }
  );

  const interItalic = new FontFace(
    "Inter",
    'url(/fonts/Inter-Italic.woff2) format("woff2")',
    {
      style: "italic",
      weight: "400",
    }
  );

  const interBoldItalic = new FontFace(
    "Inter",
    'url(/fonts/Inter-BoldItalic.woff2) format("woff2")',
    {
      style: "italic",
      weight: "700",
    }
  );

  await inter.load();
  await interBold.load();
  await interItalic.load();
  await interBoldItalic.load();

  document.fonts.add(inter);
  document.fonts.add(interBold);
  document.fonts.add(interItalic);
  document.fonts.add(interBoldItalic);
}
