import { SSEStreamingApi } from "hono/streaming";

function getSSEStreamFromRequest(
  req: Request,
  modifiers?: { onClose: () => void }
): SSEStreamingApi {
  const { readable, writable } = new TransformStream();
  const stream = new SSEStreamingApi(writable, readable);

  const keepAlive = setInterval(() => {
    stream.write(":\n\n");
  }, 1000);

  req.signal.addEventListener("abort", () => {
    clearInterval(keepAlive);
    modifiers?.onClose();
    // not really safe, but for a toy-like implementation is good enough
    stream.close();
  });

  return stream;
}

export default { getSSEStreamFromRequest };
