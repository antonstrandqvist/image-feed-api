export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-2">Image Feed API</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-8">Next.js App Router + Supabase</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Base URL</h2>
          <pre className="mt-2 rounded bg-gray-100 dark:bg-gray-800 p-3 text-sm overflow-auto text-gray-900 dark:text-gray-100">/api</pre>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Endpoints</h2>
          <div className="mt-4 space-y-6">
            <div>
              <h3 className="font-semibold">GET /api/images</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Query: <code className="bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded">page</code> (1-20, default 1)</p>
              <pre className="mt-2 rounded bg-gray-100 dark:bg-gray-800 p-3 text-sm overflow-auto text-gray-900 dark:text-gray-100">{`
{
  "page": 1,
  "total_pages": 20,
  "data": [
    {
      "id": "uuid",
      "image_url": "https://picsum.photos/300?random=12",
      "likes_count": 5,
      "comments": [
        { "commenter_name": "Alice", "comment": "Beautiful photo!" }
      ]
    }
  ]
}
`}</pre>
            </div>

            <div>
              <h3 className="font-semibold">GET /api/images/[id]</h3>
              <pre className="mt-2 rounded bg-gray-100 dark:bg-gray-800 p-3 text-sm overflow-auto text-gray-900 dark:text-gray-100">{`
{
  "id": "uuid",
  "image_url": "https://picsum.photos/300?random=12",
  "likes_count": 5,
  "comments": [
    { "commenter_name": "Sara", "comment": "This is stunning!" }
  ]
}
`}</pre>
            </div>

            <div>
              <h3 className="font-semibold">POST /api/images/[id]/like</h3>
              <pre className="mt-2 rounded bg-gray-100 dark:bg-gray-800 p-3 text-sm overflow-auto text-gray-900 dark:text-gray-100">{`{ "success": true, "likes_count": 6 }`}</pre>
            </div>

            <div>
              <h3 className="font-semibold">DELETE /api/images/[id]/like</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Removes the most recent like for an image.</p>
              <pre className="mt-2 rounded bg-gray-100 dark:bg-gray-800 p-3 text-sm overflow-auto text-gray-900 dark:text-gray-100">{`{ "success": true, "likes_count": 5 }`}</pre>
            </div>

            <div>
              <h3 className="font-semibold">POST /api/images/[id]/comment</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Body:</p>
              <pre className="mt-2 rounded bg-gray-100 dark:bg-gray-800 p-3 text-sm overflow-auto text-gray-900 dark:text-gray-100">{`
{
  "commenter_name": "John Doe",
  "comment": "Amazing shot!"
}
`}</pre>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Response:</p>
              <pre className="mt-2 rounded bg-gray-100 dark:bg-gray-800 p-3 text-sm overflow-auto text-gray-900 dark:text-gray-100">{`
{
  "success": true,
  "image_id": "uuid",
  "comment": { "commenter_name": "John Doe", "comment": "Amazing shot!" }
}
`}</pre>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Seeding</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">POST <code className="bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded">/api/seed</code> to insert up to 200 Picsum images.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Notes</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>Pagination: 10 images per page, up to 20 pages.</li>
            <li>No authentication required.</li>
            <li>Likes and comments persisted in Supabase.</li>
            <li>CORS enabled for all origins on all endpoints.</li>
            <li>Images are proxied through /api/images/proxy to handle CORS.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
