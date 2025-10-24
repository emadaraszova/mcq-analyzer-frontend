import { toPng } from "html-to-image";

export async function copyElementAsPng(
  el: HTMLElement,
  fileName = "chart.png"
) {
  const dataUrl = await toPng(el, {
    cacheBust: true,
    backgroundColor: "#ffffff",
    pixelRatio: 2,
  });

  const blob = await (await fetch(dataUrl)).blob();

  const canClipboard =
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    "write" in navigator.clipboard &&
    typeof (window as any).ClipboardItem !== "undefined";

  if (canClipboard) {
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    return "copied" as const;
  }

  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = fileName;
  a.click();
  return "downloaded" as const;
}
