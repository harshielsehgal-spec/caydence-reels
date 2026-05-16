## Replace base64 encoder with async chunked version

**File:** `src/components/modals/UploadAttemptModal.tsx`

### 1. Add `blobToBase64Async` helper (module scope)

```ts
async function blobToBase64Async(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const chunkSize = 32768;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
    if (i % (chunkSize * 10) === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  return btoa(binary);
}
```

### 2. Replace inline encoder in `uploadBlob`

Current (lines ~483–500):
```ts
let base64: string;
try {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  base64 = btoa(binary);
} catch (err) { ... }
```

New:
```ts
let base64: string;
try {
  base64 = await blobToBase64Async(blob);
  setDebugInfo((d) => ({ ...d, base64Length: base64.length }));
} catch (err) {
  const msg = `Failed to read recording: ${(err as Error)?.message || err}`;
  console.error("[upload]", msg);
  setDebugInfo((d) => ({ ...d, status: "error", error: msg }));
  setState({ kind: "failed", message: msg });
  return;
}
```

### 3. Debug overlay

Already renders `Base64: <length> chars` when `base64Length` is set — no JSX change needed.

No other code touched.
