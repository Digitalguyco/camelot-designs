// Renders a JSON-LD structured-data block. `data` is trusted, server-built
// content (never raw user input), serialized safely against `</script>` breakout.
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
