async function test() {
  const query = `query {
    frieren: Media(search: "Sousou no Frieren", type: ANIME) { id idMal title { romaji } }
    sololeveling: Media(search: "Solo Leveling", type: ANIME) { id idMal title { romaji } }
    jujutsu: Media(search: "Jujutsu Kaisen", type: ANIME) { id idMal title { romaji } }
  }`;
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  console.log(data.data);
}
test();
