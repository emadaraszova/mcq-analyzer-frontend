import { toPng } from "html-to-image";

/** --- Converts a DOM element to PNG and copies or downloads it --- **/
export async function copyElementAsPng(
  el: HTMLElement,
  fileName = "chart.png"
) {
  // --- Render element to PNG data URL ---
  const dataUrl = await toPng(el, {
    cacheBust: true,
    backgroundColor: "#ffffff",
    pixelRatio: 2,
  });

  const blob = await (await fetch(dataUrl)).blob();

  // --- Check clipboard support ---
  const canClipboard =
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    "write" in navigator.clipboard &&
    typeof (window as any).ClipboardItem !== "undefined";

  // --- Copy to clipboard if supported ---
  if (canClipboard) {
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    return "copied" as const;
  }

  // --- Fallback: trigger download if clipboard unsupported ---
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = fileName;
  a.click();
  return "downloaded" as const;
}
